<template>
    <v-container v-if="!products">
        <v-row>
            <v-col class="d-flex justify-center">
                <v-progress-circular indeterminate :size="75" :width="5"></v-progress-circular>
            </v-col>
        </v-row>
    </v-container>
    <v-data-iterator v-else :items="products" :search="search">
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

export default {
    // beforeRouteLeave() {
    //     this.unsubsribeFromNotifications();
    // },
    // beforeMount() {
    //     window.onbeforeunload = (e) => {
    //         this.unsubsribeFromNotifications();
    //     };
    // },
    // mounted() {
    //     this.subscribeToNotifications();
    // },
    setup() {
        useHead({ title: useNuxtApp().$t('homePage') });

        getCatalog();

        const products = computed(() => {
            const products = useCatalogStore().products;
            useStructuredDataStore().setMultipleProductPageStructuredData(products);
            return products;
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
        // subscribeToNotifications() {
        //     console.debug("start ws connection")
        //     const wsUrl = `${useRuntimeConfig().public.bffUrl}catalog`;
        //     this.socket = io(wsUrl);

        //     this.socket.on('connect_error', (e) => console.log("error:", e));
        //     this.socket.on('connect', function () {
        //         console.debug('Connected to wss');
        //     });

        //     this.socket.on('update', ({ data }) => {
        //         console.debug('update', data);
        //     });

        //     // this.socket = useBffNotifications('catalog/sse');
        //     // console.log("The response:", this.socket);


        //     // this.socket.addEventListener("message", (e) => console.log('New message', JSON.parse(e.data)));
        //     // this.socket.addEventListener("error", (event) => this.unsubsribeFromNotifications());
        // },
        // unsubsribeFromNotifications() {
        //     this.socket.disconnect();
        //     window.onbeforeunload = null;
        //     console.log("wws connection closed");
        // },
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
