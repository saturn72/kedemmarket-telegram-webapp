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

    <v-card v-if="loading" height="100%" flat class="d-flex flex-column align-center justify-center">
        <v-card-text>
            <AppProgressCircular />
        </v-card-text>
    </v-card>

    <CheckoutErrorDialog :show="error" @retry="$router.go();"></CheckoutErrorDialog>
    <CheckoutOrderDialog :show="orderDialog"></CheckoutOrderDialog>
    <v-stepper v-model="step" flat hide-actions>
        <v-stepper-header>
            <v-stepper-item :title="$t('billingInfo')" :value="steps[0]" />
            <v-divider></v-divider>
            <v-stepper-item :complete="requireShipping" :title="$t('shippingAddress')" :value="steps[1]" />
            <v-divider></v-divider>
            <v-stepper-item :title="$t('checkout')" :value="steps[2]" />
        </v-stepper-header>
        <v-stepper-window>
            <v-stepper-window-item :value="steps[0]">
                <CheckoutDetailsBillingInfo :profile="profile" :loading="loading"
                    @saved_billing_info="checkout_approveBillingInfo" />
            </v-stepper-window-item>

            <v-stepper-window-item :value="steps[1]">
                <v-btn block color="info" variant="outlined" @click="toStep(steps[0])">
                    <template v-slot:prepend><v-icon>
                            mdi-arrow-right
                        </v-icon>
                    </template>
                    {{ $t('backToBillingInfo') }}</v-btn>
                <CheckoutDetailsShippingAddress :profile="profile" :loading="loading"
                    @save_shipping_address="checkout_approveShippingAddress" />
            </v-stepper-window-item>

            <v-stepper-window-item :value="steps[2]">

                <v-btn block color="info" variant="outlined" @click="toStep(steps[1])">
                    <template v-slot:prepend><v-icon>
                            mdi-arrow-right
                        </v-icon>
                    </template>
                    {{ $t('backToShippingAddress') }}</v-btn>
                <CheckoutDetailsCheckoutItems :loading="loading" @submitOrder="submitOrder"></CheckoutDetailsCheckoutItems>
            </v-stepper-window-item>
        </v-stepper-window>
    </v-stepper>
</template>
<script setup>

const requireShipping = computed(() => !useCheckoutCartStore().items.some(i => i.product.isShipEnabled));

</script>
<script>
import _ from "lodash";
import { useCheckoutCartStore } from "@/stores/checkoutCart";
import { useCartStore } from "@/stores/cart";
import { submitOrder } from "@/services/checkout";
import { getUserProfile, saveUserProfile } from "~/services/profile";

export default {
    async mounted() {
        this.loading = true;
        const { data, error } = await useAsyncData(() => getUserProfile());

        this.profile = data;
        if (!this.profile?.billingInfo?.valid)
            this.toStep(this.steps[0]);
        this.loading = false;
        this.step = this.steps[this.steps.length - 1];
    },
    data() {
        return {
            // steps: ["billingInfo", "shippingAddress", "checkout"],
            steps: ["billingInfo", "shippingAddress", "checkout"],
            step: '',
            itemToDelete: null,
            loading: true,
            orderDialog: false,
            profile: {}
        }
    },
    methods: {
        errorRetry() {
            setupWorker()
        },
        toStep(stepId) {
            this.step = stepId;
            if (stepId == 0 && !this.profile?.billingInfo?.valid) {
                const txt = this.$t("updateBillingInfoIsRequired");
                useAlertStore().setSnackbar(txt);
            }
        },
        async checkout_approveBillingInfo(modified) {
            this.loading = true;
            if (modified) {
                this.profile = await saveUserProfile(this.profile);
            }
            this.loading = false;
            this.toStep(this.steps[1]);
        },
        async checkout_approveShippingAddress(address) {
            this.loading = true;
            console.log("add address to checkout info")
            // if (modified) {
            //     this.profile = await saveUserProfile(this.profile);
            // }
            this.loading = false;
            this.toStep(this.steps[2]);
        },
        async submitOrder() {
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
