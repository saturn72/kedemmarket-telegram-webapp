<template>
    <ProductCartAddButton v-if="qty == 0" :product="product"></ProductCartAddButton>
    <ProductCartPlusMinusButtons v-else :product="product"></ProductCartPlusMinusButtons>
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
