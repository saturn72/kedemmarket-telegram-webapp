import { defineStore } from 'pinia'
import _ from 'lodash';
import { useCartStore } from './cart';
import { CheckoutCart } from 'model';

type CheckoutCartState = CheckoutCart & { calculating: boolean };

let timoutRef: NodeJS.Timeout;

const defaultValue = {
    userCart: undefined,
    cartTotal: 0,
    totalDiscounts: 0,
    items: [],
    calculating: false
};

const calculateInternal = async (): Promise<CheckoutCartState> => {
    const userCart = useCartStore().getUserCart;

    if (!userCart || useCartStore().getTotalCartItemsCount == 0) {
        return defaultValue;
    }

    return await useNuxtApp().$backend.prepareCartForCheckout(userCart);
}

export const useCheckoutCartStore = defineStore('checkoutCart', {
    state: (): CheckoutCartState => defaultValue,
    actions: {
        clear(): void {
            this.$state = defaultValue
        },
        async calculate(timeout: number = 2000): Promise<void> {
            this.$state.calculating = true;
            this.$state.userCart = useCartStore().getUserCart;
            if (timoutRef) {
                clearTimeout(timoutRef);
            }

            timoutRef = setTimeout(async () => {
                this.$state = await calculateInternal();
                this.$state.calculating = false;
            }, timeout)
        },
    }
})