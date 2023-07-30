import { PiniaPluginContext } from 'pinia'
import { useCartStore } from '@/stores/cart';
import { useUserStore } from '@/stores/user';

function CartPiniaPlugin({ store }: PiniaPluginContext) {
    store.$subscribe((mutation, state) => {
        if (mutation.storeId != 'cart') {
            return;
        }
        const userCart = state.usersCarts[useUserStore().user.uid];
        useNuxtApp().$backend.updateCart(userCart);
    })
}

export default defineNuxtPlugin(async ({ $backend, $pinia }: any) => {
    $pinia.use(CartPiniaPlugin);

    const user = useUserStore().user;
    if (!user || !user.uid) {
        return;
    }

    const cart = useCartStore().getUserCart;

    if (!cart || cart?.items?.length == 0) {
        const serverCart = await $backend.getCart();
        useCartStore().setCart(serverCart)
    }
    else {

        await $backend.updateCart(cart);
    }
});
