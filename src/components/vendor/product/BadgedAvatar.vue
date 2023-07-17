<template>
    <v-badge :model-value="qty > 0" :content="qty" color="success" rounded size="medium">
        <VendorProductAvatar :product="product"></VendorProductAvatar>
    </v-badge>
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
}
</script>
