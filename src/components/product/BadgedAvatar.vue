<template>
    <v-badge :model-value="qty > 0" :content="qty" color="success" rounded size="medium">
        <ProductAvatar :images="images"></ProductAvatar>
    </v-badge>
</template>
<script>
import { useCartStore } from '@/stores/cart'
import { getProductMediaUrl } from "@/services/catalog";

export default {
    props: {
        product: { type: Object },
        imageIndex: { type: Number, default: 0 }
    },
    async mounted() {
        const t = await getProductMediaUrl(this.product, "thumbnail", this.imageIndex);
        const i = await getProductMediaUrl(this.product, "image", this.imageIndex);
        this.images = [t, i];
    },
    data: () => {
        return {
            images: []
        }
    },
    computed: {
        qty() {
            return useCartStore().getProductQuantity(this.product.id);
        }
    },
}
</script>
