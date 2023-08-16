import { defineStore } from 'pinia'
import { CartItem, Product } from '~/model';
import _ from 'lodash';
import { useUserStore } from './user';
import { UserCart } from 'model';
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
    const userId = useUserStore().getUser.uid;

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
    state: (): CartState => defaultValue
    ,
    getters: {

        getUserCart(state): UserCart | undefined {
            const userId = useUserStore().getUser.uid;
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

        clearCart(): void {
            const userId = useUserStore().getUser.uid;
            this.$state.usersCarts[userId] = undefined;
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