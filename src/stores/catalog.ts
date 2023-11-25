// import { defineStore } from 'pinia'
// import { Product, Store, Vendor } from 'models/catalog';
// import { getStores } from "services/catalog";
// import _ from 'lodash';

// type CatalogState = {
//     stores?: Store[] | undefined;
//     vendors?: Vendor[] | undefined;
// }


// const getAllProducts = (stores: Store[] | undefined): Stores[] | undefined => {
//     // if (!stores) {
//     //     return undefined;
//     // }
//     // const vendorArray = stores.map(s => {
//     //     if (s.vendors) {
//     //         return s.vendors;
//     //     }
//     // });

//     // const f = _.flatten(vendorArray);
//     // return _.uniqBy(f, x => x?.id) as Vendor[];
// }

// const getAllVendors = (stores: Store[] | undefined): Vendor[] | undefined => {
//     if (!stores) {
//         return undefined;
//     }
//     const vendorArray = stores.map(s => {
//         if (s.vendors) {
//             return s.vendors;
//         }
//     });

//     const f = _.flatten(vendorArray);
//     return _.uniqBy(f, x => x?.id) as Vendor[];
// }

// export const useCatalogStore = defineStore('catalog', {

//     state: (): CatalogState => {
//         return {
//             stores: undefined,
//             vendors: undefined,
//         }
//     },

//     getters: {

//         getVendors(state): Vendor[] | undefined {
//             return getAllVendors(state.stores);
//         },

//         getProducts(state): Product[] | undefined {
//             const products = getAllProducts(state.stores);

//             const vendors = getAllVendors(state.stores);
//             if (!vendors) {
//                 return undefined;
//             }

//             const vendorProductArray = vendors.map(v => {
//                 if (v.products) {
//                     return v.products;
//                 }
//             });

//             return _.flatten(vendorProductArray) as Product[];
//         },
//     },
//     actions: {
//         async loadCatalog(): Promise<void> {
//             const data = await getStores();
//             if (data) {
//                 this.stores = data;
//             }
//         },
//     },

//     persist: {
//         storage: persistedState.sessionStorage
//     }
// })