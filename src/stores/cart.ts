import { defineStore } from 'pinia'
import { Product } from '~/model';
import _ from 'lodash';
import { useUserStore } from './user';

type CartItem = {
    product: Product;
    orderedQuantity: number;
    addedOnUtc: Date
}
type UserCart = {
    items: CartItem[]
};

type CartState = {
    usersCarts: [key: string, items: UserCart] | any
}

const findItem = (items: CartItem[] | undefined, productId: any): CartItem | undefined => {
    if (!items) {
        return undefined;
    }
    return items?.find((i: CartItem) => i.product.id === productId);
}

const getCurrentUserCart = (state: any): UserCart => {
    const userId = useUserStore().getUser.uid;

    if (!state.usersCarts[userId]) {
        state.usersCarts[userId] = { items: [] };
    }
    return state.usersCarts[userId];
}

export const useCartStore = defineStore('cart', {
    state: (): CartState => {
        return {
            usersCarts: {}
        };
    },
    getters: {
        getUserCart(state): UserCart {
            return getCurrentUserCart(state);
        },

        getCartItemCount(state): number {
            let t = 0;
            const cart = getCurrentUserCart(state);
            cart?.items?.forEach((ci: CartItem) => t += ci.orderedQuantity);
            return t;
        },

        getCartTotal(state): number {
            let t = 0;

            const cart = getCurrentUserCart(state);
            cart?.items?.forEach((ci: CartItem) => t += ci.orderedQuantity * ci.product.price);
            return t;
        }
    },
    actions: {

        setCart(cart: any) {
            const userId = useUserStore().getUser.uid;
            this.$state.usersCarts[userId] = cart;
        },

        incrementCartItem(product: Product): void {
            const cart = getCurrentUserCart(this.$state);
            const existCartItem = findItem(cart.items, product.id);

            if (!existCartItem) {
                const ci = {
                    product, orderedQuantity: 1, addedOnUtc: new Date(),
                };
                cart.items.push(ci);

            } else {
                existCartItem.orderedQuantity++;
            };
        },

        decrementCartItem(product: Product): void {
            const cart = getCurrentUserCart(this.$state);
            const ci = findItem(cart.items, product.id);
            if (!ci) {
                return;
            }

            if (ci.orderedQuantity > 0) {
                ci.orderedQuantity--;
                if (ci.orderedQuantity === 0) {
                    _.remove(cart.items, (ci: CartItem) => ci.product.id === product.id);
                }
            }
        },

        removeItemFromCart(product: Product): void {
            const cart = getCurrentUserCart(this.$state)
            const ci = findItem(cart.items, product.id);
            if (!ci) {
                return;
            }
            _.remove(cart.items, (ci: CartItem) => ci.product.id === product.id);
        },

        clearCart(): void {
            this.$reset();
        },

        getProductQuantity(productId: any): number {
            const cart = getCurrentUserCart(this.$state)
            const ci = findItem(cart.items, productId);
            return ci?.orderedQuantity || 0;
        }
    },
    persist: {
        storage: persistedState.localStorage
    }
})