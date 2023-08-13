import { defineStore } from 'pinia'
import _ from 'lodash';
import { useCartStore } from './cart';
import { CheckoutCart } from 'model';

type CheckoutCartState = CheckoutCart;

let timoutRef: NodeJS.Timeout;

const calculateInternal = async (): Promise<CheckoutCartState> => {
    const userCart = useCartStore().getUserCart;

    if (!userCart || useCartStore().getTotalCartItemsCount == 0) {
        return {
            userCart: undefined,
            cartTotal: 0,
            totalDiscounts: 0,
            items: []
        };
    }

    return await useNuxtApp().$backend.prepareCartForCheckout(userCart);
}

export const useCheckoutCartStore = defineStore('checkoutCart', {
    state: (): CheckoutCartState => {
        return {
            userCart: undefined,
            cartTotal: 0,
            totalDiscounts: 0,
            items: []
        };
    },
    actions: {
        async calculate(timeout: number = 2000): Promise<void> {
            this.$state.userCart = useCartStore().getUserCart;
            if (timoutRef) {
                clearTimeout(timoutRef);
            }
            timoutRef = setTimeout(async () => {
                this.$state = await calculateInternal();
                clearTimeout(timoutRef);
            }, timeout)
        }
    }
})