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
            <v-stepper-item v-if="requireShipping" :title="$t('shippingAddress')" :value="steps[1]" />
            <v-divider></v-divider>
            <v-stepper-item :title="$t('checkout')" :value="steps[2]" />
        </v-stepper-header>
        <v-stepper-window>
            <v-stepper-window-item :value="steps[0]">
                <CheckoutDetailsBillingInfo :profile="profile" :loading="loading"
                    @saved_billing_info="checkout_approveBillingInfo" />
            </v-stepper-window-item>

            <v-stepper-window-item :value="steps[1]">
                <v-btn block color="info" variant="outlined" @click="toStep(0)">
                    <template v-slot:prepend><v-icon>
                            mdi-arrow-right
                        </v-icon>
                    </template>
                    {{ $t('backToBillingInfo') }}</v-btn>
                <CheckoutDetailsShippingAddress :profile="profile" :loading="loading"
                    @shipping-address-selected="checkout_selectShippingAddress" />
            </v-stepper-window-item>

            <v-stepper-window-item :value="steps[2]">
                <v-btn block color="info" variant="outlined" @click="toStep(requireShipping ? 1 : 0)">
                    <template v-slot:prepend><v-icon>
                            mdi-arrow-right
                        </v-icon>
                    </template>
                    {{ requireShipping ? $t('backToShippingAddress') : $t('backToBillingInfo') }}</v-btn>
                <CheckoutDetailsCheckoutItems :loading="loading" @submit-order="onSubmitOrder">
                </CheckoutDetailsCheckoutItems>
            </v-stepper-window-item>
        </v-stepper-window>
    </v-stepper>
</template>
<script setup>

const requireShipping = computed(() => useCheckoutCartStore().shippingRequired);

</script>
<script>
import _ from "lodash";
import { useCheckoutCartStore } from "@/stores/checkoutCart";
import { useCartStore } from "@/stores/cart";
import { submitOrder } from "@/services/checkout";
import { getUserProfile, saveUserProfile } from "~/services/profile";
import { clearOrderCache } from "~/services/order";

export default {
    async mounted() {
        this.loading = true;

        this.profile = await getUserProfile();

        if (this.requireShipping) {
            if (this.profile.shipping?.addresses?.length == 0) {
                this.profile.shipping = { useBillingAddress: true };
            }
            if (this.profile.shipping?.useBillingAddress) {
                const c = _.cloneDeep(this.profile.billingInfo);
                const a = _.omit(c, ['valid']);
                this.checkout_selectShippingAddress(a);
            }
            const da = this.profile.shipping?.addresses.find(a => a.isDefault);
            if (da) {
                this.checkout_selectShippingAddress(da);
            }
        }

        this.toNextStep();
        this.loading = false;
    },
    data() {
        return {
            steps: ["1", "2", "3"],
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
        toStep(to) {
            this.step = this.steps[to];
        },
        toNextStep(from) {
            if (!from) {
                if (!this.profile?.billingInfo?.valid) {
                    this.toStep(0);
                    const txt = this.$t("updateBillingInfoIsRequired");

                    useAlertStore().setSnackbar(txt, {});
                    return;
                }

                if (useCheckoutCartStore().shippingRequired && !useCheckoutCartStore().shippingAddress) {
                    this.toStep(1);
                    return;
                }
            }
            this.toStep(2);
        },
        async checkout_approveBillingInfo(modified) {
            this.loading = true;

            if (modified) {
                this.profile = await saveUserProfile(this.profile);
            }

            this.loading = false;
            this.toNextStep(0);
        },
        async checkout_selectShippingAddress(address) {
            this.loading = true;
            useCheckoutCartStore().setShippingAddress(address);
            this.loading = false;
            this.toNextStep(1);
        },
        async onSubmitOrder() {
            this.orderDialog = true;
            const order = await submitOrder();

            const ro = encodeURIComponent(JSON.stringify(order));
            const r = `${useAppConfig().routes.postPurchaseRoute}?order=${ro}`;
            useRouter().push(r)

            clearOrderCache();
            useCartStore().clear();
            useCheckoutCartStore().clearUserCart();
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
