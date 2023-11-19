<template>
    <v-divier></v-divier>
    <CheckoutProductDetails v-for="item in useCheckoutCartStore().notAvailableItems" :cartItem="item">
    </CheckoutProductDetails>
</template>

<script>
import { useCheckoutCartStore } from "@/stores/checkoutCart";

export default {
}
</script>
