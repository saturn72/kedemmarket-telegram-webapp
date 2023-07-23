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
            <v-autocomplete v-model="select" v-model:search="search" :loading="loading" :items="items" class="mx-4"
                density="comfortable" hide-no-data hide-details :label="$t('productSearch')">
            </v-autocomplete>
            <v-card-text>
                <v-row justify="center">
                    <v-col cols="6" v-for=" product  in  itemsToDisplay " :key="product.id">
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

        return {
            products,
        }
    },
    watch: {
        search(val) {
            if (!val || val.trim().length == 0) {
                this.itemsToDisplay = this.products;
            }

            this.loading = true
            const term = val.toLowerCase();

            this.itemsToDisplay = this.products.filter(p => {
                return p.name.toLowerCase().indexOf((term || '')) > -1
                // ||
                // p.description.toLowerCase().indexOf((term || '')) > -1 ||
                // p.price.indexOf((term || '')) > -1;
            })
            // this.items = this.searchItems.filter(e => {
            //     return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1
            // })
            this.loading = false
            // console.log(val)
            // val && val !== this.select && this.querySelections(val)
        },
        products(newValue) {
            this.searchItems = newValue.map(p => p.name);
        }
    },
    data() {
        return {
            loading: false,
            items: [],
            search: null,
            select: null,
            searchItems: []
        }
    }
}
</script>