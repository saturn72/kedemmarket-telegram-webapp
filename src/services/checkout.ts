import { Order } from "model";
import { useCheckoutCartStore } from "@/stores/checkoutCart";
import { getOrdersCacheKeyPrefix } from "./order";
import { useCartStore } from "@/stores/cart";

export async function submitOrder(): Promise<Order | undefined> {
    const checoutCart = useCheckoutCartStore();

    if (checoutCart.items.length == 0 ||
        !checoutCart.userCart ||
        checoutCart.userCart.items.length == 0) {
        return;
    }
    const order = {
        items: checoutCart.userCart.items,
    };

    const res = await useNuxtApp().$backend.placeOrder(order);
    const prefix = getOrdersCacheKeyPrefix();
    useNuxtApp().$cache.removeByPrefix(prefix);

    checoutCart.clear();
    useCartStore().clearCart();

    return res;
}
