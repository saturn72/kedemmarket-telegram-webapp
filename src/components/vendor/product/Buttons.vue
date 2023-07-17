<template>
    <VendorProductCartAddButton v-if="qty == 0" :product="product"></VendorProductCartAddButton>
    <VendorProductCartPlusMinusButtons v-else :product="product"></VendorProductCartPlusMinusButtons>
</template>
<script>

import { useCartStore } from '@/stores/cart'

export default {
    props: {
        product: { type: Object, default: {} },
    },
    computed: {
        qty() {
            return useCartStore().getProductQuantity(this.product.id);
        }
    }
}
</script>
