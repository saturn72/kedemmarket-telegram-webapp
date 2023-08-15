import { UserCart } from "model";
import { useCheckoutCartStore } from "@/stores/checkoutCart";
import { getOrdersCacheKeyPrefix } from "./order";

export async function submitOrder(): Promise<UserCart | undefined> {
    const cart = useCheckoutCartStore();

    if (cart.items.length == 0) {
        return;
    }
    const res = await useNuxtApp().$backend.placeOrder(cart);
    const prefix = getOrdersCacheKeyPrefix();
    useNuxtApp().$cache.removeByPrefix(prefix);

    cart.clear();
    return res;
}
