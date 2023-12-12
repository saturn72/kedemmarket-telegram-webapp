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

    <CheckoutErrorDialog :show="error" @retry="$router.go();"></CheckoutErrorDialog>
    <CheckoutOrderDialog :show="orderDialog"></CheckoutOrderDialog>
    <v-stepper :items="items" v-model="step" flat hide-actions>
        <template v-slot:item.1>
            <CheckoutDetailsProfileBillingAddressCard :profile="profile" :loading="loading"
                @saved_billing_address="checkout_approveBillingaAddress" />
        </template>
        <template v-slot:item.2>
            <v-btn block color="info" variant="outlined" @click="step = 1">
                <template v-slot:prepend><v-icon>
                        mdi-arrow-right
                    </v-icon>
                </template>
                {{ $t('backToBillingAddress') }}</v-btn>
            <CheckoutDetailsCheckoutItems :loading="loading" />
        </template>
    </v-stepper>
</template>

<script>
import _ from "lodash";
import { useCheckoutCartStore } from "@/stores/checkoutCart";
import { useCartStore } from "@/stores/cart";
import { submitOrder } from "@/services/checkout";
import { getUserProfile, saveUserProfile } from "~/services/profile";

export default {
    async setup() {

        const { data: profile, error } = await useAsyncData(() => getUserProfile());

        return {
            profile,
            error
        };
    },
    mounted() {
        if (!this.profile?.billingAddress?.valid)
            this.step = 1;

        this.items = [
            this.$t("billingAddress"),
            this.$t("checkout"),
        ];
    },
    data() {
        return {
            step: 2,
            items: [],
            itemToDelete: null,
            orderDialog: false,
        }
    },
    methods: {
        errorRetry() {
            setupWorker()
        },
        async checkout_approveBillingaAddress(modified) {
            this.loading = true;
            if (modified) {
                await saveUserProfile(this.profile);
            }
            this.loading = false;
            this.step = 2;
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
