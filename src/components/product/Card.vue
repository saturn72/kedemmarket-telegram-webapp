<template>
    <v-card flat>
        <v-card-title class="d-flex justify-center">
            <ProductBadgedAvatar :product="product"></ProductBadgedAvatar>
        </v-card-title>
        <v-card-text>
            {{ product.name }}<strong>&centerdot; {{ product.price }} {{
                $t('currencySymbol') }}</strong></v-card-text>
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