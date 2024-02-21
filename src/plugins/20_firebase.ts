import type { FirebaseApp } from "firebase/app";
import { initializeApp } from "firebase/app";
import type { Messaging } from "firebase/messaging";
import { getMessaging, getToken as getMessagingToken } from "firebase/messaging";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import type { Auth } from "firebase/auth";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useUserStore } from "@/stores/user";
import { getToken as getAppCheckToken, type AppCheck } from "firebase/app-check";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import type { UserProfile } from "@/models/account";
import type { CartItem, Order, UserCart } from "@/models/cart";
import _ from "lodash";
import type { ErrorResponse } from "~/models/common";

const configureAuth = (app: FirebaseApp): Auth => {
    const auth = getAuth(app);
    auth.useDeviceLanguage();

    auth.onAuthStateChanged(async user => {
        const u = user != null ? user : undefined;
        const userStore = useUserStore();
        if (!u) {
            signInAnonymously(auth);
            userStore.setUser(u); //undefined
        }

        if (u?.isAnonymous) {
            userStore.setAnonymousUserId(u.uid);
            userStore.setUser(u); //undefined
        }
        else {
            const auid = userStore.getAnonymousUserId as string;
            const cartStore = useCartStore();

            const anonymouUserCart: UserCart | undefined = useCartStore().getUserCart;
            delete cartStore.$state.usersCarts[userStore.getAnonymousUserId as string];

            userStore.setUser(u);
            cartStore.setCart(anonymouUserCart as UserCart);
            executeFunction('fromAnonymousUser', { anonymousUid: auid });
        }
    });

    return auth;
}

const configureAppCheck = (app: FirebaseApp): AppCheck | undefined => {
    const k = useAppConfig().reCaptcha;
    return initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(k),
        isTokenAutoRefreshEnabled: true,
    });
}

const initCloudMessaging = async (app: FirebaseApp): Promise<Messaging | undefined> => {
    const messaging = getMessaging(app);
    const permission = await Notification.requestPermission();

    if (permission != 'granted') {
        return undefined;
    }

    const token = await getMessagingToken(messaging, {
        vapidKey: useAppConfig().firebase.vapidKey,
    });

    if (!token) {
        return undefined;
    }
    executeFunction('subscribeToNotifications', { tokens: [token], topics: ["catalog"] });

    return messaging;
}

const executeFunction = async (functionName: string, payload?: any): Promise<any | ErrorResponse> => {
    const f = getFunctions();
    const po = httpsCallable(f, functionName);

    try {
        const res = await po(payload);
        return res.data;
    } catch (err) {
        return { message: `failed to run \'${functionName}\'` };
    }
}

let appCheck: AppCheck | undefined;

export default defineNuxtPlugin(async (nuxtApp) => {
    const app: FirebaseApp = initializeApp(useAppConfig().firebase);

    const auth = configureAuth(app);
    appCheck = configureAppCheck(app);
    // await initCloudMessaging(app);

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
                        console.log(error)
                        console.debug(error);
                        createError({ data: error });
                        return null;
                    }
                }
            },
            auth,
            user: {
                async logout(): Promise<any> {
                    await auth.signOut();
                }
            },

            backend: {
                async getAppToken(): Promise<string> {
                    const appCheckTokenResponse = await getAppCheckToken(appCheck as AppCheck);
                    return appCheckTokenResponse.token;
                },
                async getOrders(options: { pageSize: number, skip: number }, status: string[] | undefined): Promise<Order[] | ErrorResponse> {
                    return await executeFunction('getOrders', { ...options, status });
                },

                async getOrderById(orderId: string): Promise<Order> {
                    return await executeFunction('getOrderById', { orderId });
                },

                async getCart(cart: UserCart): Promise<UserCart> {
                    return await executeFunction('getOrCreateCart', cart);
                },

                async placeOrder(order: { items: CartItem[], userId: any }): Promise<Order> {
                    return await executeFunction('submitOrder', order);
                },

                async updateCart(cart: UserCart): Promise<void> {
                    executeFunction('updateCart', cart);
                },

                async getUserProfile(): Promise<UserProfile> {
                    return await executeFunction('getUserProfile');
                },

                async saveUserProfile(profile: UserProfile): Promise<UserProfile> {
                    const c = _.cloneDeep(profile);
                    const p = _.omit(c, ['billingInfo.valid']);
                    return await executeFunction('saveUserProfile', p);
                }
            }
        }
    }
});

