import { defineStore } from 'pinia'
import { Store, Vendor } from '~/model';
import { getStores } from "@/services/store";
import _ from 'lodash';

type StoreState = {
    stores?: Store[] | undefined;
}

export const useStoreStore = defineStore('store', {
    state: (): StoreState => { return { stores: undefined } },

    getters: {
        getVendors(state): Vendor[] | undefined {
            if (!state.stores) {
                return undefined;
            }
            const vendorArray = state.stores.map(s => {
                if (s.vendors) {
                    return s.vendors;
                }
            });

            const f = _.flatten(vendorArray);
            return _.uniqBy(f, x => x?.id) as Vendor[];
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
})