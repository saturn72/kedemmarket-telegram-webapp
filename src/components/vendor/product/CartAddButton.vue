<template>
    <v-btn ripple block variant="flat" color="success" @click="addToCart(product)">{{ $t('addButton')
    }}</v-btn>
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
    },
    methods: {
        addToCart(product) {
            useCartStore().incrementCartItem(product);
        }
    }
}
</script>
