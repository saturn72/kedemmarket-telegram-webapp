<template>
    <v-row v-if="qty == 0">
        <v-col cols="10">
            <ProductCartAddButton :product="product"></ProductCartAddButton>
        </v-col>
        <v-col>
        </v-col>
    </v-row>
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
