import { PiniaPluginContext } from 'pinia'
import { useCartStore } from '@/stores/cart';

function CartPiniaPlugin({ store }: PiniaPluginContext) {
    store.$subscribe((mutation, state) => {
        if (mutation.storeId != 'cart') {
            return;
        }
        useNuxtApp().$backend.updateCart(state);
    })
}

export default defineNuxtPlugin(async ({ $backend, $pinia }: any) => {
    $pinia.use(CartPiniaPlugin);

    const cart = useCartStore();
    if (cart.$state.items.length == 0) {
        const serverCart = await $backend.getCart();
        cart.setCart(serverCart)
    }
    else {
        await $backend.updateCart(cart.$state);
    }
});
