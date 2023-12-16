import type { FirebaseApp } from "firebase/app";
import { initializeApp } from "firebase/app";
import type { Messaging } from "firebase/messaging";
import { getMessaging, getToken } from "firebase/messaging";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import type { Auth } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useUserStore } from "@/stores/user";
import type { AppCheck } from "firebase/app-check";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import type { UserProfile } from "@/models/account";
import type { CartItem, CheckoutCart, Order, UserCart } from "@/models/cart";
import _ from "lodash";

const configureAuth = (app: FirebaseApp): Auth => {
    const auth = getAuth(app);
    auth.useDeviceLanguage();
    auth.currentUser;

    auth.onAuthStateChanged(user => {
        if (user) {
            useUserStore().setUser(user);
        }
        else {
            useUserStore().setUser(undefined);
            useNuxtApp().$router.push(useAppConfig().routes.login);
        }
    });
    return auth;
}

const configureAppCheck = (app: FirebaseApp): AppCheck | undefined => {
    if (process.env.NODE_ENV != 'production') {
        return undefined;
    }

    const k = useAppConfig().reCaptcha;
    return initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(k),
        isTokenAutoRefreshEnabled: true
    });
}

const initCloudMessaging = async (app: FirebaseApp): Promise<Messaging | undefined> => {
    const messaging = getMessaging(app);
    const permission = await Notification.requestPermission();

    if (permission != 'granted') {
        return undefined;
    }

    const token = await getToken(messaging, {
        vapidKey: useAppConfig().firebase.vapidKey,
    });

    if (!token) {
        return undefined;
    }
    executeFunction('subscribeToNotifications', { tokens: [token], topics: ["catalog"] });

    return messaging;
}

const executeFunction = async (functionName: string, payload?: any): Promise<any> => {
    const f = getFunctions();
    const po = httpsCallable(f, functionName);
    const res = await po(payload);
    return res.data;
}

export default defineNuxtPlugin(async (nuxtApp) => {
    const app: FirebaseApp = initializeApp(useAppConfig().firebase);

    const auth = configureAuth(app);
    configureAppCheck(app);
    await initCloudMessaging(app);

    return {
        provide: {
            storage: {
                getDownloadUrl: async (uri: string): Promise<string | null> => {
                    while (uri.startsWith('/')) {
                        uri = uri.substring(1);
                    }
                    uri = uri.replaceAll("  ", " ").replaceAll(' ', '-').toLowerCase();

                    try {
                        const s = getStorage(app);
                        const r = ref(s, uri);
                        return await getDownloadURL(r);
                    } catch (error) {
                        console.debug(error);
                        createError({ data: error });
                        return null;
                    }
                }
            },
            user: {
                async logout(): Promise<any> {
                    await auth.signOut();
                }
            },

            backend: {

                async getOrders(options: { pageSize: number, skip: number }, status: string[]): Promise<Order[]> {
                    return await executeFunction('getOrders', { ...options, status });
                },

                async getOrderById(orderId: string): Promise<Order> {
                    return await executeFunction('getOrderById', { orderId });
                },

                async prepareCartForCheckout(cart: UserCart): Promise<CheckoutCart & any> {
                    return await executeFunction('prepareCartForCheckout', cart);
                },

                async getCart(cart: UserCart): Promise<UserCart> {
                    return await executeFunction('getOrCreateCart', cart);
                },

                async placeOrder(order: { items: CartItem[] }): Promise<Order> {
                    return await executeFunction('submitOrder', order);
                },

                async updateCart(cart: UserCart): Promise<void> {
                    executeFunction('updateCart', cart);
                },

                async getUserProfile(): Promise<UserProfile> {
                    return await executeFunction('getUserProfile');
                },

                async saveUserProfile(profile: UserProfile): Promise<UserProfile> {
                    const p = _.omit(profile, ['valid']);
                    return await executeFunction('saveUserProfile', p);
                }
            }
        }
    }
});

