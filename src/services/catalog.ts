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

const acquireProductMedia = async (product: Product, type: "thumbnail" | "image", imageIndex: number): Promise<string> => {
    if (!product) {
        return useAppConfig().defaults.thumbnail;
    }

    const apmis = product.media.filter(m => m.type == type);
    if (apmis.length == 0 || apmis.length >= imageIndex) {
        return useAppConfig().defaults.thumbnail;
    }

    const ppmis = _.sortBy(apmis, x => x.displayOrder);
    console.log(ppmis[imageIndex])
    return await getMediaUrlOrDefault(ppmis[imageIndex].uri, useAppConfig().defaults.thumbnail);
};
const expiration = 10 * 60;
const CatalogProductPrimaryMediaCachePrefix = "catalog:product-primary-media:";


export async function getProductBySlug(slug: string): Promise<Product | undefined> {
    await getCatalog();
    const catalog = useCatalogStore();
    if (catalog.products) {
        return catalog.products.find((p) => p.slug == slug)
    }
}

export async function getProductMediaUrl(
    product: Product,
    type: "thumbnail" | "image",
    index: number): Promise<string> {
    const p = await useNuxtApp().$cache.getOrAcquire(`${CatalogProductPrimaryMediaCachePrefix}id=${product.id}_${type}`,
        () => acquireProductMedia(product, type, index), expiration);
    return p as string;
}

export async function getCatalog(): Promise<Catalog | null | undefined> {
    const cache = useNuxtApp().$cache;
    let acquired = false;
    const catalog = await cache.getOrAcquire(`catalog:index`,
        () => {
            acquired = true;
            return acquireCatalog();
        }
        , expiration);

    if (acquired && catalog) {
        cache.removeByPrefix(CatalogProductPrimaryMediaCachePrefix);
        const allProducts = _.flatMap(catalog?.stores, "products");
        const activeProducts = _.uniqBy(allProducts, "id");
        useCartStore().updateCartProducts(activeProducts);
    }
    return catalog;
}