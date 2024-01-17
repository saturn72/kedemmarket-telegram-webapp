<template>
    <v-container v-if="!products">
        <h1>Tests</h1>
        <v-row>
            <v-col class="d-flex justify-center">
                <v-progress-circular indeterminate :size="75" :width="5"></v-progress-circular>
            </v-col>
        </v-row>
    </v-container>
    <v-container v-else>
        <AppSearchBar @onSearchUpdated="onSearchUpdated" />
        <v-card flat>
            <v-card-actions>
                <v-btn block :variant="(hasCartItems ? 'flat' : 'tonal')" size="small" color="primary"
                    transition="fade-transition" @click="navigateTo(useAppConfig().routes.checkout)"> {{ $t('goToCart')
                    }}</v-btn>
            </v-card-actions>
            <v-card-text>
                <v-row justify="center">
                    <v-col cols="6" v-for="product in itemsToDisplay" :key="product.id">
                        <ProductCard :product="product"></ProductCard>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>
  
<script>

import { useSearchStore } from '@/stores/search'

export default {
    setup() {
        const products = computed(() => useCatalogStore().products);
        const hasCartItems = computed(() => useCartStore().getCartTotal > 0);

        return {
            products,
            hasCartItems
        };
    },
    watch: {
        products() {
            this.onSearchUpdated(useSearchStore().search);
        }

    },
    methods: {
        onSearchUpdated(value) {
            if (!value || value.trim().length == 0) {
                this.itemsToDisplay = this.products;
                return;
            }

            const term = value.toLowerCase();
            this.itemsToDisplay = this.products.filter(p =>
                (!!p.name && p.name.toLowerCase().indexOf(term) > -1) ||
                (!!p.description && p.description.toLowerCase().indexOf(term) > -1) ||
                (p.tags && p.tags.some(t => t.toLowerCase().indexOf(term) > -1)));
        },
    },
    data() {
        return {
            itemsToDisplay: []
        }
    }
}
</script>