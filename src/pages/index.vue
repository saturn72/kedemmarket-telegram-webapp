<template>
    <v-container v-if="!products">
        <v-row>
            <v-col class="d-flex justify-center">
                <v-progress-circular indeterminate :size="75" :width="5"></v-progress-circular>
            </v-col>
        </v-row>
    </v-container>
    <v-container v-else>
        <AppSearchBar @onSearchUpdated="onSearchUpdated" />
        <v-card flat>
            <v-card-text>
                <v-row justify="center">
                    <v-col cols="6" v-for=" product  in  itemsToDisplay " :key="product.id">
                        <ProductCard :product="product"></ProductCard>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>
  
<script>
import { getCatalog } from '@/services/catalog'
import { useSearchStore } from '@/stores/search'

export default {
    async setup() {
        const catalog = await getCatalog();
        const products = catalog.stores[0].products;

        return {
            products
        }
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
                this.textMatchTerm(p.name, term) ||
                this.textMatchTerm(p.description, term) ||
                this.tagsMatchTerm(p.tags, term));
        },
        textMatchTerm(text, term) {
            return text && text.toLowerCase().indexOf(term) > -1;
        },

        tagsMatchTerm(tags, term) {
            return tags && tags.some(t => t.toLowerCase().indexOf(term) > -1);
        }
    },
    data() {
        return {
            itemsToDisplay: []
        }
    }
}
</script>stores/catalog