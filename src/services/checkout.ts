import type { Order } from "@/models/cart";
import { useCheckoutCartStore } from "@/stores/checkoutCart";
import { clearOrderCache } from "./order";
import { useCartStore } from "@/stores/cart";

export async function submitOrder(): Promise<Order | undefined> {
    const checoutCart = useCheckoutCartStore();

    if (checoutCart.items.length == 0 ||
        !checoutCart.userCart ||
        checoutCart.userCart.items.length == 0) {
        return;
    }
    const userId = useUserStore().getUser.uid;
    const order = {
        items: checoutCart.userCart.items,
        userId,
        shippingAddress: checoutCart.shippingAddress,
    };

    const res = await useNuxtApp().$backend.placeOrder(order);
    clearOrderCache();

    useCartStore().clear();
    checoutCart.clearUserCart();

    return res;
}
