import { defineStore } from 'pinia'
import type { Product } from '@/models/catalog';
import _ from 'lodash';
import { useUserStore } from './user';
import type { CartItem, CartProductMessage, UserCart } from '~/models/cart';
import { diff } from "deep-object-diff";

type CartState = {
    usersCarts: [key: string, items: UserCart] | any
}

const findItem = (items: CartItem[] | undefined, productId: any): CartItem | undefined => {
    if (!items) {
        return undefined;
    }
    return items?.find((i: CartItem) => i.product.id === productId);
}

const getOrCreateCurrentUserCart = (state: any): UserCart => {
    const userId = useUserStore().getUser?.uid;

    if (!state.usersCarts[userId]) {
        state.usersCarts[userId] = { items: [] };
    }
    return state.usersCarts[userId];
}

const setCartItemPrice = (item: CartItem) => {
    const p = item.product;
    item.totalPrice = item.orderedQuantity * p.price;
}
const defaultValue = {
    usersCarts: {}
};

export const useCartStore = defineStore('cart', {
    state: (): CartState => defaultValue,
    getters: {
        getUserCart(state): UserCart | undefined {
            const userId = useUserStore().getUser?.uid;
            if (!userId) {
                return undefined;
            }

            return getOrCreateCurrentUserCart(state);
        },

        getTotalCartItemsCount(state): number {
            let t = 0;
            const cart = getOrCreateCurrentUserCart(state);
            cart?.items?.forEach((ci: CartItem) => t += ci.orderedQuantity);
            return t;
        },

        getCartTotal(state): number {
            let t = 0;

            const cart = getOrCreateCurrentUserCart(state);
            cart?.items?.forEach((ci: CartItem) => t += ci.orderedQuantity * ci.product.price);
            return t;
        }
    },
    actions: {
        setCart(cart: UserCart) {
            const userId = useUserStore().getUser.uid;
            this.$state.usersCarts[userId] = cart;
            cart.items?.forEach(ci => setCartItemPrice(ci));
        },

        incrementCartItem(product: Product, quantity: number = 1): void {
            const cart = getOrCreateCurrentUserCart(this.$state);
            const existCartItem = findItem(cart.items, product.id);

            if (!existCartItem) {
                const ci = {
                    product,
                    orderedQuantity: quantity,
                    addedOnUtc: new Date(),
                };
                setCartItemPrice(ci);
                cart.items.push(ci);

            } else {
                existCartItem.orderedQuantity += quantity;
                setCartItemPrice(existCartItem);
            };
        },

        decrementCartItem(product: Product): void {
            const cart = getOrCreateCurrentUserCart(this.$state);
            const ci = findItem(cart.items, product.id);
            if (!ci) {
                return;
            }

            if (ci.orderedQuantity > 0) {
                ci.orderedQuantity--;
                if (ci.orderedQuantity === 0) {
                    _.remove(cart.items, (ci: CartItem) => ci.product.id === product.id);
                }
                setCartItemPrice(ci);
            }
        },

        removeItemFromCart(product: Product): void {
            const cart = getOrCreateCurrentUserCart(this.$state)
            const ci = findItem(cart.items, product.id);
            if (!ci) {
                return;
            }
            _.remove(cart.items, (ci: CartItem) => ci.product.id === product.id);
        },

        updateCartProducts(activeProducts: Product[]): void {
            const cart = getOrCreateCurrentUserCart(this.$state);
            const updated: CartProductMessage[] = [];
            const productIdsToRemove: any[] = [];
            for (let idx = 0; idx < cart.items.length; idx++) {
                const ci = cart.items[idx];
                const updatedProduct = activeProducts.find(ap => ap.id == ci.product.id);

                if (updatedProduct) {
                    const d = {
                        from: ci.product,
                        to: updatedProduct,
                        diff: diff(ci.product, updatedProduct)
                    };
                    ci.product = updatedProduct;
                    if (Object.keys(d.diff).length > 0) {
                        updated.push(d);
                    }
                    setCartItemPrice(ci);
                    continue;
                }
                productIdsToRemove.push(ci.product.id);
            }

            if (productIdsToRemove.length > 0) {
                _.remove(cart.items, c => productIdsToRemove.some(pi => pi == c.product.id));
            }

            if (updated.length > 0) {
                cart.messages = cart.messages?.filter(x => x.type != 'product-update') ?? [];
                updated.forEach(u => cart.messages.push({ type: 'product-update', ...u }));
                const txt = useNuxtApp().$t('cartProductsChanged');
                useAlertStore().setSnackbar(txt, { force: true });
            }

        },
        clear(): void {
            const userId = useUserStore().getUser.uid;
            this.$state.usersCarts[userId] = { items: [] };
        },

        getProductQuantity(productId: any): number {
            const cart = getOrCreateCurrentUserCart(this.$state)
            const ci = findItem(cart.items, productId);
            return ci?.orderedQuantity || 0;
        }
    },
    persist: {
        storage: persistedState.localStorage
    }
})