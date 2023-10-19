import { Store, Vendor } from "models/catalog";
import { getVendorByRoute } from "./vendor";

const acquireStore = async (): Promise<Store[] | undefined | null> => {
    const url = await useNuxtApp().$storage.getDownloadUrl(`catalog/stores.json`);
    if (!url) {
        return undefined;
    }
    const all = await $fetch<any>(url);
    const res: Store[] = []

    if (all.stores) {
        for (let index = 0; index < all.stores.length; index++) {
            const curStore = all.stores[index];

            const vendors: Vendor[] = [];
            for (const vendorData of curStore.vendors ?? []) {
                const vendorRoute = `${curStore.name}/${vendorData.name}`;
                const vendor = await getVendorByRoute(vendorRoute);
                if (vendor) {
                    vendors.push(vendor);
                }
            }

            res.push({
                id: curStore.id,
                name: curStore.name,
                vendors,
            });
        }
    }
    return res;
}

const expiration = 10 * 60;
export async function reload(): Promise<Store[] | null | undefined> {
    const stores = acquireStore();
    await useNuxtApp().$sessionCache.set(`kedem-market-store`, stores, expiration);
    return stores;
}

export async function getStores(): Promise<Store[] | null | undefined> {
    return await useNuxtApp().$sessionCache.getOrAcquire(`kedem-market-store`,
        () => acquireStore(), expiration);
}