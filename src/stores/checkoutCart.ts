import _ from 'lodash';
import { CheckoutCart, CheckoutCartItem } from 'models/cart';
import { defineStore } from 'pinia'
import { useCartStore } from './cart';
import { useUserStore } from './user';
import { useBackendFetch } from '../services/backend';

type CheckoutCartState = CheckoutCart & { calculating: boolean, error: boolean };

let timoutRef: NodeJS.Timeout;

const defaultValue = {
    userCart: undefined,
    cartTotal: 0,
    totalDiscounts: 0,
    items: [],
    calculating: false,
    error: false
};

const calculateInternal = async (state: CheckoutCartState): Promise<void> => {
    const userCart = useCartStore().getUserCart;
    if (!userCart || useCartStore().getTotalCartItemsCount == 0) {
        state = defaultValue;
        return;
    }

    const items = userCart.items.map(p => {
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

    for (let index = 0; index < data.Items.length; index++) {
        const cur = data.Items[index];

        const p = state.userCart?.items.find(x => x.product.id == cur.ProductId);
        const cp = _.cloneDeep(p);
        if (!cp) {
            continue;
        }

        cp.orderedQuantity = cur.Quantity;
        stateItems.push({
            cartTotal: cur.SubTotalValue,
            itemPrice: cur.UnitPriceValue,
            numericDiscount: cur.DiscountValue,
            percentageDiscount: 1 - (cur.DiscountValue / cur.UnitPriceValue),
            priceAfterDiscounts: cur.UnitPriceValue - cur.DiscountValue,
            priceBeforeDiscounts: cur.UnitPriceValue,
            ...cp,
        });
        state.cartTotal += cur.SubTotalValue;
        state.totalDiscounts += cur.numericDiscount;
    }
    state.items = stateItems;
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
                this.$state.calculating = true;
                await calculateInternal(this.$state);
                this.$state.calculating = false;
            }, timeout)
        },
    }
})