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
            <v-text-field outlined prepend-inner-icon="mdi-magnify" :label="$t('productSearch')" clearable persistent-clear
                v-model="search" :loading="loading" density="comfortable" hide-no-data hide-details>
            </v-text-field>
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
import { useSearchStore } from '@/stores/search';
import { computed } from 'vue'

export default {
    setup() {
        const store = useStoreStore();
        store.setStore();
        const products = computed(() => store.getProducts);
        return {
            products
        }
    },
    mounted() {
        this.search = useSearchStore().search;
    },
    watch: {
        search(val) {
            this.updateSearch(val);
        },
        products(newValue) {
            this.updateSearch(this.search);
        }
    },
    methods: {
        textMatchTerm(text, term) {
            return text && text.toLowerCase().indexOf(term) > -1;
        },

        tagsMatchTerm(tags, term) {
            return tags && tags.some(t => t.toLowerCase().indexOf(term) > -1);
        },

        updateSearch(value) {
            if (useSearchStore().search != value) {
                useSearchStore().setSearch(value);
            }

            this.loading = true
            if (!value || value.trim().length == 0) {
                this.itemsToDisplay = this.products;
                this.loading = false
                return;
            }
            const term = value.toLowerCase();

            this.itemsToDisplay = this.products.filter(p =>
                this.textMatchTerm(p.name, term) ||
                this.textMatchTerm(p.description, term) ||
                this.tagsMatchTerm(p.tags, term));

            this.loading = false
        }
    },
    data() {
        return {
            loading: false,
            search: undefined,
            itemsToDisplay: []
        }
    }
}
</script>