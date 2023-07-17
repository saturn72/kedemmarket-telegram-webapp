<template>
    <v-row>
        <v-col cols="6">
            <v-btn ripple variant="flat" block color="success" @click="incrementVendorCartItem(product)">
                <v-icon>mdi-plus</v-icon>
            </v-btn>
        </v-col>
        <v-col cols="6">
            <v-btn ripple variant="flat" block color="warning" @click="decrementVendorCartItem(product)">
                <v-icon>mdi-minus</v-icon>
            </v-btn>
        </v-col>
    </v-row>
</template>
<script>

import { useCartStore } from '@/stores/cart'

export default {
    props: {
        product: { type: Object, default: {} },
    },
    methods: {
        incrementVendorCartItem(product) {
            useCartStore().incrementVendorCartItem(product);
        },
        decrementVendorCartItem(product) {
            useCartStore().decrementVendorCartItem(product);
        }
    }
}
</script>
