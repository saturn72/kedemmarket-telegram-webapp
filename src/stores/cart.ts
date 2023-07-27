import { defineStore } from 'pinia'
import { Product } from '~/model';
import _ from 'lodash';

type CartItem = {
    product: Product;
    orderedQuantity: number;
    addedOnUtc: Date
}

type CartState = {
    items: CartItem[]
}

const findItem = (items: CartItem[] | undefined, productId: any): CartItem | undefined => {
    if (!items) {
        return undefined;
    }
    return items?.find((i: CartItem) => i.product.id === productId);
}

export const useCartStore = defineStore('cart', {
    state: (): CartState => {
        return {
            items: []
        };
    },
    getters: {

        getCartItemCount(state): number {
            let t = 0;
            state.items?.forEach((ci: CartItem) => t += ci.orderedQuantity);
            return t;
        },

        getCartTotal(state): number {
            let t = 0;
            state.items?.forEach((ci: CartItem) => t += ci.orderedQuantity * ci.product.price);
            return t;
        }
    },
    actions: {

        incrementCartItem(product: Product): void {
            const existCartItem = findItem(this.$state.items, product.id);

            if (!existCartItem) {
                const ci = {
                    product, orderedQuantity: 1, addedOnUtc: new Date(),
                };
                this.$state.items.push(ci);

            } else {
                existCartItem.orderedQuantity++;
            };
            useNuxtApp().$backend.updateCart(this.$state);
        },

        decrementCartItem(product: Product): void {
            const ci = findItem(this.$state.items, product.id);
            if (!ci) {
                return;
            }

            if (ci.orderedQuantity > 0) {
                ci.orderedQuantity--;
                if (ci.orderedQuantity === 0) {
                    _.remove(this.$state.items, (ci: CartItem) => ci.product.id === product.id);
                }
            }
            useNuxtApp().$backend.updateCart(this.$state);
        },

        removeItemFromCart(product: Product): void {
            const ci = findItem(this.$state.items, product.id);
            if (!ci) {
                return;
            }
            _.remove(this.$state.items, (ci: CartItem) => ci.product.id === product.id);
            useNuxtApp().$backend.updateCart(this.$state);
        },

        clearCart(): void {
            this.$reset();
            useNuxtApp().$backend.updateCart(this.$state);
        },

        getProductQuantity(productId: any): number {
            const ci = findItem(this.$state.items, productId);
            return ci?.orderedQuantity || 0;
        }
    },
    persist: {
        storage: persistedState.localStorage
    }
})