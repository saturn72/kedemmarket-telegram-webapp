<template>
    <v-dialog v-click-outside="resetRemoveFromCart" v-model="itemToDelete" width="auto" class="text-center"> <v-card>
            <v-card-text>{{ dialogText }}</v-card-text>
            <v-card-actions>
                <v-btn color="warning" @click="onConfirmRemoveFromCart">{{ $t('confirm') }}</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="resetRemoveFromCart">{{ $t('cancel') }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <!-- <CheckoutErrorDialog :show="error" @retry="$router.go();"></CheckoutErrorDialog> -->
    <CheckoutOrderDialog :show="orderDialog"></CheckoutOrderDialog>

    <v-stepper :items="items" show-actions v-model="step">
        <template v-slot:item.1>
            <ProfileBillingAddressFields :profile="profile" :mode="billingAddressMode" @saved="billingAddressSaved">
            </ProfileBillingAddressFields>
        </template>
        <template v-slot:item.2>
            <h1>TEsts 2</h1>
            <!-- <ProfileBillingAddress :profile="profile" :mode="billingAddressMode" @saved="billingAddressSaved">
                </ProfileBillingAddress> -->
        </template>
    </v-stepper>
    <!-- <v-stepper-header>
        <v-stepper-item complete :rules="[() => profile.billingAddress.valid]" :title="$t('billingAddress')" value="1">
        </v-stepper-item>
        <v-divider></v-divider>
        <v-stepper-item :title="$t('checkout')" subtitle="Missing Details" value="2"></v-stepper-item>
    </v-stepper-header>
</v-stepper>
 -->
</template>

<script>
import _ from "lodash";
import { useCheckoutCartStore } from "@/stores/checkoutCart";
import { useCartStore } from "@/stores/cart";
import { submitOrder } from "@/services/checkout";
import { getUserProfile } from "~/services/profile";

export default {

    async setup() {
        const checkoutCartStore = computed(() => useCheckoutCartStore());

        const loading = computed(() => {
            const items = useCheckoutCartStore().items;
            return items && items.some(i => i.loading);
        });

        const error = computed(() => useCheckoutCartStore().error || false);
        const calculating = computed(() => useCheckoutCartStore().calculating || false);

        useCheckoutCartStore().calculate(0);

        const profile = await getUserProfile();
        return {
            calculating,
            checkoutCartStore,
            error,
            loading,
            profile
        };
    },
    mounted() {
        // if (!profile.billingAddress.valid) {
        if (this.profile.billingAddress.valid) {
            this.step = "0";
            this.billingAddressMode = "edit";
        } else {
            this.step = "1";
        }
        this.items = [
            this.$t("billingAddress"),
            this.$t("checkout"),
        ];
    },
    data() {
        return {
            itemToDelete: null,
            orderDialog: false,
            step: "",
            billingAddressMode: undefined,
            items: []
        }
    },
    methods: {
        errorRetry() {
            setupWorker()
        },
        async checkout_submitOrder() {
            this.orderDialog = true;

            const order = await submitOrder();
            const ro = encodeURIComponent(JSON.stringify(order));
            const r = `${useAppConfig().routes.postPurchaseRoute}?order=${ro}`;
            useRouter().push(r)
        },

        removeFromCart(item) {
            const t = this.$t('deleteFromCart');
            this.dialogText = t.replace("##0##", item.product.name)
            this.itemToDelete = item;
        },

        onConfirmRemoveFromCart() {
            const userCart = useCartStore();
            userCart.removeItemFromCart(this.itemToDelete.product);
            _.remove(useCheckoutCartStore().items,
                i => i.product.id == this.itemToDelete.product.id);

            this.resetRemoveFromCart();
            useCheckoutCartStore().calculate(2000);
        },
        resetRemoveFromCart() {
            this.itemToDelete = null;
        },
    },
}
</script>
