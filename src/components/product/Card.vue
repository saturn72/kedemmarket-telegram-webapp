<template>
    <v-card flat>
        <v-card-title class="d-flex justify-center">
            <ProductBadgedAvatar :product="product"></ProductBadgedAvatar>
        </v-card-title>
        <v-card-text>
            <strong> {{ product.name }}</strong>
            <!-- <strong>&centerdot; {{ product.price }} {{ $t('currencySymbol') }}</strong> -->

            <v-divider thickness="2"></v-divider>
            <ProductPrice :product="product" />
        </v-card-text>
        <v-card-actions>
            <ProductButtons :product="product"></ProductButtons>
        </v-card-actions>
    </v-card>
</template>
<script>
export default {
    props: {
        product: { type: Object }
    }
}
</script>