<template>
    <v-card flat density="compact" ripple>
        <v-card-title class="d-flex justify-center">
            <ProductBadgedAvatar :product="product" :imageIndex="imageIndex"></ProductBadgedAvatar>
        </v-card-title>
        <v-card-text>
<<<<<<< HEAD
            <NuxtLink :to="`${useAppConfig().routes.product}/${product.slug}`">
                <strong> {{ product.name }}</strong>
            </NuxtLink>
            <!-- <strong>&centerdot; {{ product.price }} {{ $t('currencySymbol') }}</strong> -->
            <v-divider thickness="2"></v-divider>
            <ProductPrice :product="product" />
=======
            <v-row v-if="getImages().length > 1" v-for="(item, index) in getImages()">
                <h1>{{ item }}</h1>
                <v-avatar class="ma-1" :image="item" rounded="0" @click="updateImageIndex(index)">{{ item
                }}</v-avatar>
            </v-row>
            <v-row>
                <NuxtLink :to="`${useAppConfig().routes.product}/${product.slug}`">
                    <strong> {{ product.name }}</strong>
                </NuxtLink>
                <v-divider thickness="2"></v-divider>
                <ProductPrice :product="product" />
            </v-row>
>>>>>>> b9c2dc34cff96266c40817d31c3f0ab4b159e1a7
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
    },
    data() {
        imageIndex: 0
    },
    methods: {
        updateImageIndex(index) {
            this.imageIndex = index;
        },
        getImages() {
            return this.product.media.filter(i => i.type == "image");
        },
    }
}
</script>