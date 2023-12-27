import type { Catalog, Product } from "@/models/catalog";
import { useCartStore } from "@/stores/cart";
import _ from "lodash";
import { getMediaUrlOrDefault } from "./media";

const acquireCatalog = async (): Promise<Catalog | undefined | null> => {
    const url = await useNuxtApp().$storage.getDownloadUrl(`catalog/index.json`);
    if (!url) {
        return undefined;
    }

    return await $fetch<Catalog>(url);
}

const acquireProductPrimaryMedia = async (product: Product, type: "thumbnail" | "image"): Promise<string> => {
    if (!product) {
        return useAppConfig().defaults.thumbnail;
    }

    const apmis = product.media.filter(m => m.type == type);
    if (apmis.length == 0) {
        return useAppConfig().defaults.thumbnail;
    }

    let ppmi = apmis[0];
    for (let index = 1; index < apmis.length; index++) {
        const c = apmis[index];
        if (c.displayOrder < ppmi.displayOrder) {
            ppmi = c;
        }
    }
    return await getMediaUrlOrDefault(ppmi.url, useAppConfig().defaults.thumbnail);
};
const expiration = 10 * 60;

export async function getProductPrimaryMediaUrl(product: Product, type: "thumbnail" | "image"): Promise<string> {
    const p = await useNuxtApp().$cache.getOrAcquire(`catalog:product-primary-media:${type}`,
        () => acquireProductPrimaryMedia(product, type), expiration);
    return p as string;
}

export async function getCatalog(): Promise<Catalog | null | undefined> {
    const catalog = await useNuxtApp().$cache.getOrAcquire(`catalog:index`,
        () => acquireCatalog(), expiration);

    const allProducts = _.flatMap(catalog?.stores, "products");
    const activeProducts = _.uniqBy(allProducts, "id");

    useCartStore().updateCartProducts(activeProducts);
    return catalog
}