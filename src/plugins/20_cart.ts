import { UserCart } from 'model';
import { PiniaPluginContext } from 'pinia'
import { useCartStore } from '@/stores/cart';
import { useUserStore } from '@/stores/user';
import { useAlertStore } from '@/stores/alert';

const showSnackbarIfRequired = (cart: UserCart): void => {
    const enteredTier = cart.items.some(c => {
        if (c.orderedQuantity == 1) {
            return false;
        }

        const tp = c.product.tierPrices;
        if (!tp || tp.length == 0) {
            return false;
        }
        var tierQuantities = tp.map((t: { quantity: number }) => t.quantity)
        return tierQuantities.includes(c.orderedQuantity);
    });

    if (enteredTier) {
        useAlertStore().setAlarm('snackbar', useNuxtApp().$t("priceUpdatesAtCheckout"));
    }
}

function CartPiniaPlugin({ store }: PiniaPluginContext) {
    store.$subscribe((mutation, state) => {
        if (mutation.storeId != 'cart') {
            return;
        }
        const userCart = state.usersCarts[useUserStore().user.uid];
        if (!userCart) {
            return;
        }
        useNuxtApp().$backend.updateCart(userCart);

        showSnackbarIfRequired(userCart);
    })
}

export default defineNuxtPlugin(async ({ $backend, $pinia }: any) => {
    $pinia.use(CartPiniaPlugin);

    const user = useUserStore().user;
    if (!user || !user.uid) {
        return;
    }

    const userCart = useCartStore().getUserCart;

    if (!userCart || !userCart?.items || userCart?.items.length == 0) {
        const serverCart = await $backend.getCart();
        useCartStore().setCart(serverCart)
    }
    else {
        await $backend.updateCart(userCart);
    }
});
