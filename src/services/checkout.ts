import { Order } from "model";
import { useCheckoutCartStore } from "@/stores/checkoutCart";
import { getOrdersCacheKeyPrefix } from "./order";
import { useCartStore } from "@/stores/cart";

export async function submitOrder(): Promise<Order | undefined> {
    const cart = useCheckoutCartStore();

    if (cart.items.length == 0 ||
        !cart.userCart ||
        cart.userCart.items.length == 0) {
        return;
    }
    const order = {
        items: cart.userCart.items,
    }
    const res = await useNuxtApp().$backend.placeOrder(order);
    const prefix = getOrdersCacheKeyPrefix();
    useNuxtApp().$cache.removeByPrefix(prefix);

    cart.clear();
    useCartStore().clearCart();

    return res;
}
