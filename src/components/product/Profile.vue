<template>
    <v-card flat density="compact" ripple>
        <v-card-title class="d-flex justify-center">
            <ProductGallery :product="product">
            </ProductGallery>
        </v-card-title>
        <v-card-text>
            <strong> {{ product.name }}</strong>
            <!-- <strong>&centerdot; {{ product.price }} {{ $t('currencySymbol') }}</strong> -->
            <v-divider thickness="2"></v-divider>
            <ProductPrice :product="product" />
            <v-chip v-if="qty > 0">
                {{ quantityText }}
            </v-chip>
            <p v-if="description">
                <v-text-area>
                    {{ description }}
                </v-text-area>
            </p>
        </v-card-text>
        <v-card-actions>
            <ProductButtons :product="product"></ProductButtons>
        </v-card-actions>
    </v-card>
</template>
<script>
export default {
    props: {
        product: { type: Object, default: {} }
    },
    computed: {
        description() {
            const fd = this.product.fullDescription;
            const sd = this.product.shortDescription
            return (fd && fd != null) ? fd : (sd && sd != null) ? sd : undefined;
        },
        qty() {
            const q = useCartStore().getProductQuantity(this.product.id);
            const t = this.$t('productCartQuantity');
            this.quantityText = t.replace("##0##", q);
            return q;
        }
    },
    data: () => {
        return { quantityText: '' }
    }
}
</script>