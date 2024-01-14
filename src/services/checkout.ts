import type { CartItem, Order } from "@/models/cart";
import { useCheckoutCartStore } from "@/stores/checkoutCart";

export async function submitOrder(): Promise<Order | undefined> {
    const checoutCart = useCheckoutCartStore();

    if (checoutCart.items.length == 0 ||
        !checoutCart.userCart ||
        checoutCart.userCart.items.length == 0) {
        return;
    }

    const { items, orderTotal, totalDiscounts } = prepareOrderItems(checoutCart.userCart.items)
    const userId = useUserStore().getUser.uid;
    const order = {
        items,
        orderTotal,
        originalSentItems: checoutCart.userCart.items,
        shippingAddress: checoutCart.shippingAddress,
        totalDiscounts,
        userId,
    };
    return await useNuxtApp().$backend.placeOrder(order);
}

const prepareOrderItems = (cartItems: CartItem[]) => {
    const items = [];

    for (let index = 0; index < cartItems.length; index++) {
        const cur = cartItems[index];
        cur.priceBeforeDiscounts = cur.orderedQuantity * cur.product.price;
        cur.priceAfterDiscounts = cur.priceBeforeDiscounts;
        cur.numericDiscount = 0;
        cur.percentageDiscount = 0;

        const product = cur.product;
        // only tier price is supportted at this point
        if (product.tierPrices && product.tierPrices.length > 0) {
            let lastTier = { quantity: 0 };
            for (let idx = 0; idx < product.tierPrices.length; idx++) {
                const curTier = product.tierPrices[idx];

                if (lastTier.quantity < curTier.quantity &&
                    cur.orderedQuantity >= curTier.quantity) {
                    lastTier = { ...curTier };
                    cur.priceAfterDiscounts = cur.orderedQuantity * curTier.price;
                    cur.percentageDiscount =
                        cur.priceAfterDiscounts / cur.priceBeforeDiscounts;
                    cur.numericDiscount =
                        cur.priceBeforeDiscounts - cur.priceAfterDiscounts;
                }
            }
        }
        items.push(cur);
    }

    let orderTotal = 0;
    let totalDiscounts = 0;
    items.map((x) => {
        orderTotal += x.priceAfterDiscounts;
        totalDiscounts += x.numericDiscount;
    });
    return { items, orderTotal, totalDiscounts };
}
