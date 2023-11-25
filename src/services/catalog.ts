import { Catalog } from "models/catalog";
import { useCartStore } from "@/stores/cart";
import _ from "lodash";

const acquireCatalog = async (): Promise<Catalog | undefined | null> => {
    const url = await useNuxtApp().$storage.getDownloadUrl(`catalog/index.json`);
    if (!url) {
        return undefined;
    }

    return await $fetch<Catalog>(url);
    // const res: Store[] = []

    // if (all.stores) {
    //     for (let index = 0; index < all.stores.length; index++) {
    //         const curStore = all.stores[index];

    //         const vendors: Vendor[] = [];
    //         for (const vendorData of curStore.vendors ?? []) {
    //             const vendorRoute = `${curStore.name}/${vendorData.name}`;
    //             const vendor = await getVendorByRoute(vendorRoute);
    //             if (vendor) {
    //                 vendors.push(vendor);
    //             }
    //         }

    //         res.push({
    //             id: curStore.id,
    //             name: curStore.name,
    //             vendors,
    //         });
    //     }
    // }

    // return res;
}

const expiration = 10 * 60;

export async function getCatalog(): Promise<Catalog | null | undefined> {
    const catalog = await useNuxtApp().$cache.getOrAcquire(`catalog:index`,
        () => acquireCatalog(), expiration);

    const allProducts = _.flatMap(catalog?.stores, "products");
    const activeProducts = _.uniqBy(allProducts, "id");

    useCartStore().updateProductsAvailability(activeProducts);
    return catalog
}