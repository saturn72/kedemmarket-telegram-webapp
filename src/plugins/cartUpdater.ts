import { Plugin } from 'nuxt/app';
import { PiniaPluginContext } from 'pinia'

function CartUpdaterPiniaPlugin({ store }: PiniaPluginContext) {
    store.$onAction((action) => {
        if (action.store.$id != 'cart') {
            return;
        }

        if (action.name == 'decrementVendorCartItem' ||
            action.name == 'incrementVendorCartItem') {
            const { $backend } = useNuxtApp();
            $backend.updateCart();
        }
    });
}

export default defineNuxtPlugin(({ $pinia }) => {
    $pinia.use(CartUpdaterPiniaPlugin);
});
