import { defineStore } from 'pinia'
import { Product, Store, Vendor } from 'models/catalog';
import { getStores } from "@/services/store";
import _ from 'lodash';

type StoreState = {
    stores?: Store[] | undefined;
}

const getAllStoresVendors = (stores: Store[] | undefined): Vendor[] | undefined => {
    if (!stores) {
        return undefined;
    }
    const vendorArray = stores.map(s => {
        if (s.vendors) {
            return s.vendors;
        }
    });

    const f = _.flatten(vendorArray);
    return _.uniqBy(f, x => x?.id) as Vendor[];
}

export const useStoreStore = defineStore('store', {
    state: (): StoreState => { return { stores: undefined } },
    getters: {

        getVendors(state): Vendor[] | undefined {
            return getAllStoresVendors(state.stores);
        },

        getProducts(state): Product[] | undefined {
            const vendors = getAllStoresVendors(state.stores);
            if (!vendors) {
                return undefined;
            }

            const vendorProductArray = vendors.map(v => {
                if (v.products) {
                    return v.products;
                }
            });

            return _.flatten(vendorProductArray) as Product[];
        }
    },
    actions: {
        async setStore(): Promise<void> {
            const data = await getStores();
            if (data) {
                this.stores = data;
            }
        },
    },
    persist: {
        storage: persistedState.sessionStorage
    }
})