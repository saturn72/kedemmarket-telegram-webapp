<template>
    <v-data-iterator :items="products" :search="search" items-per-page="100">
        <template v-slot:header>
            <v-toolbar class="px-2">
                <AppSearchBar @onSearchUpdated="onSearchUpdated" />
            </v-toolbar>
        </template>

        <template v-slot:default="{ items }">
            <v-card flat>
                <v-card-actions>
                    <v-btn block :variant="(hasCartItems ? 'flat' : 'tonal')" size="small" color="primary"
                        transition="fade-transition" @click="navigateTo(useAppConfig().routes.checkout)"> {{ $t('goToCart')
                        }}</v-btn>
                </v-card-actions>

                <v-card-text>
                    <v-row justify="center">
                        <v-col cols="6" v-for="item in items" :key="item.raw.id">
                            <ProductCard :product="item.raw"></ProductCard>
                        </v-col>
                    </v-row>

                </v-card-text>

            </v-card>
        </template>
    </v-data-iterator>
</template>
    
<script>
function textMatchsTerm(text, term) { text && text.toLowerCase().indexOf(term) > -1; }
function tagsMatchTerm(tags, term) { tags && tags.some(t => t.toLowerCase().indexOf(term) > -1); }

import { useSearchStore } from '@/stores/search'
import { getCatalog } from '~/services/catalog';
import _ from "lodash";

export default {
    setup() {
        useHead({ title: useNuxtApp().$t('homePage') });
        getCatalog();

        const products = computed(() => {
            const products = _.sortBy(useCatalogStore().products, 
            o => [o.displayOrder, o.name]);
            useStructuredDataStore().setMultipleProductPageStructuredData(products);
            return products.sort(p => p.displayOrder);
        });

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
            this.search = value;
            if (!value || value.trim().length == 0) {
                this.itemsToDisplay = this.products;
                return;
            }

            const term = value.toLowerCase();
            this.itemsToDisplay = this.products.filter(p =>
                textMatchsTerm(p.name, term) ||
                textMatchsTerm(p.description, term) ||
                tagsMatchTerm(p.tags, term));
        },
    },
    data() {
        return {
            itemsToDisplay: [],
            search: '',
            socket: {},
        }
    }
}
</script>
