import _ from 'lodash';
import type { CartItem, CheckoutCart, CheckoutCartItem } from '@/models/cart';
import { defineStore } from 'pinia'
import { useCartStore } from './cart';
import { useUserStore } from './user';
import { useBackendFetch } from '../services/backend';
import type { Address } from '~/models/account';

type CheckoutCartState = CheckoutCart & {
    notAvailableItems: CartItem[]
    calculating: boolean,
    error: boolean
    shippingAddress?: Address | undefined
};

let timoutRef: NodeJS.Timeout;

const defaultValue = {
    userCart: undefined,
    cartTotal: 0,
    totalDiscounts: 0,
    items: [],
    notAvailableItems: [],
    calculating: false,
    error: false,
    shippingAddress: undefined
};

const calculateInternal = async (state: CheckoutCartState): Promise<void> => {
    const userCart = useCartStore().getUserCart;
    if (!userCart || useCartStore().getTotalCartItemsCount == 0) {
        state = defaultValue;
        return;
    }
    const items = userCart.items.map((p: CartItem) => {
        return {
            productId: p.product.id,
            orderedQuantity: p.orderedQuantity,
        }
    });

    const { data, error } = await useBackendFetch("shopping-cart", {
        method: "POST",
        body: {
            storeId: 1,
            userId: useUserStore().getUser.uid,
            items,
        }
    });

    if (error) {
        state.error = true;
        return;
    }

    state.userCart = userCart;

    const stateItems: CheckoutCartItem[] = [];
    state.totalDiscounts = 0;
    state.cartTotal = 0;

    const scis = state.userCart?.items ?? [];
    for (let index = 0; index < scis.length; index++) {
        const cur = scis[index];
        const di = data.Items.find((t: any) => t.ProductId == cur.product.id);
        if (!di) {
            state.notAvailableItems.push({ ...di });
        }

        const cp = _.cloneDeep(cur);
        if (!cp) {
            continue;
        }

        cp.orderedQuantity = di.Quantity;
        cp.numericDiscount = di.DiscountValue;
        cp.percentageDiscount = 1 - (di.DiscountValue / di.UnitPriceValue);
        cp.priceAfterDiscounts = di.UnitPriceValue - di.DiscountValue;
        cp.priceBeforeDiscounts = di.UnitPriceValue;
        stateItems.push({
            ...cp,
            cartTotal: di.SubTotalValue,
            itemPrice: di.UnitPriceValue,
        });
        state.cartTotal += di.SubTotalValue;
        state.totalDiscounts += di.numericDiscount;
    }
    state.items = stateItems;
}

export const useCheckoutCartStore = defineStore('checkoutCart', {
    state: (): CheckoutCartState => defaultValue,
    getters: {
        shippingRequired(state) {
            return state.items.some(i => i.product.isShipEnabled);
        }
    },
    actions: {
        clearUserCart(): void {
            this.$state.userCart = useCartStore().getUserCart;
        },

        //builds the checout cart, and sort items by availalbility etc.
        async calculate(timeout: number = 2000): Promise<void> {
            this.$state.calculating = true;
            this.$state.userCart = useCartStore().getUserCart;
            if (timoutRef) {
                clearTimeout(timoutRef);
            }

            timoutRef = setTimeout(async () => {
                this.$state.calculating = true;
                await calculateInternal(this.$state);
                this.$state.calculating = false;
            }, timeout)
        },
        setShippingAddress(address: Address) {
            this.$state.shippingAddress = address;
        }
    }
})