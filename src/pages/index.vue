<template>
    <v-container v-if="!products">
        <v-row>
            <v-col class="d-flex justify-center">
                <v-progress-circular indeterminate :size="75" :width="5"></v-progress-circular>
            </v-col>
        </v-row>
    </v-container>
    <v-container v-else>
        <v-card flat>
            {{ searchItems }}
            <v-autocomplete :items="searchItems">

            </v-autocomplete>
            <v-card-text>
                <v-row justify="center">
                    <v-col cols="6" v-for="product in products" :key="product.id">
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
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>
  
<script>
import { useStoreStore } from '@/stores/store'
import { computed } from 'vue'

export default {
    setup() {
        const store = useStoreStore();
        store.setStore();

        const products = computed(() => store.getProducts);
        let searchItems = [];

        watch(products, (newValue) => {
            searchItems = newValue.map(p => p.name);
        });
        return {
            products,
            searchItems: [],
        }
    }
}
</script>