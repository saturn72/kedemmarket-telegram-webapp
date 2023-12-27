import { defineStore } from 'pinia'
import type { Catalog, Product } from '@/models/catalog';
import _ from 'lodash';
import { getCatalog } from '~/services/catalog';

type CatalogState = Catalog & {
    products?: Product[]
}

const defaultValue = {
    createdOnUtc: undefined,
    version: undefined,
    stores: [],
    products: [],
};

export const useCatalogStore = defineStore('catalog', {
    state: (): CatalogState => defaultValue,
    actions: {
        async loadCatalog() {
            const catalog = await getCatalog();
            if (!catalog || catalog == null || this.$state.version == catalog.version) {
                return;
            }

            this.$state.createdOnUtc = catalog.createdOnUtc;
            this.$state.version = catalog.version;
            this.$state.stores = catalog.stores;
            this.$state.products = _.flatMap(catalog?.stores, "products");
        },
    }
})
