<template>
    <v-card height="100%" flat class="d-flex flex-column justify-center">
        <v-card-title v-if="loading || calculating" class="d-flex flex-column align-center justify-center">
            <v-progress-circular indeterminate width="1"></v-progress-circular>
        </v-card-title>

        <v-card-title>
            <v-icon>mdi-cart-outline</v-icon>
            <v-spacer></v-spacer>
            {{ $t('cartTotal') }}&nbsp;{{ $t('currencySymbol') }}{{ checkoutCartStore.cartTotal }}
            <v-card-subtitle>
                {{ $t('pricesAfterDiscounts') }}
            </v-card-subtitle>
        </v-card-title>

        <v-card-text>
            <CheckoutDetailsAvailableItems @removeFromCart="removeFromCart" />
            <!-- <CheckoutNotAvailableItems></CheckoutNotAvailableItems> -->
        </v-card-text>

        <v-card-actions>
            <v-btn block variant="flat" :loading="loading || calculating"
                :disabled="loading || checkoutCartStore.items.length == 0" color="secondary"
                @click="checkout_submitOrder()">{{
                    $t('checkoutCart')
                }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script setup>
const checkoutCartStore = computed(() => useCheckoutCartStore());

const loading = computed(() => {
    const items = useCheckoutCartStore().items;
    return items && items.some(i => i.loading);
});
</script>
<script>
export default {
    props: {
        loading: {
            type: Boolean, default: false
        },
    },
    setup() {
        const checkoutCartStore = computed(() => useCheckoutCartStore());

        const loading = computed(() => {
            const items = useCheckoutCartStore().items;
            return items && items.some(i => i.loading);
        });

        const error = computed(() => useCheckoutCartStore().error || false);
        const calculating = computed(() => useCheckoutCartStore().calculating || false);

        useCheckoutCartStore().calculate(0);

        return {
            calculating,
            checkoutCartStore,
            error,
            loading
        };
    },
}
</script>