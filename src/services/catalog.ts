import type { Catalog, Product } from "@/models/catalog";
import { useCartStore } from "@/stores/cart";
import _ from "lodash";
import { getMediaUrlOrDefault } from "./media";
import { useBffFetch } from "./backend";

const acquireCatalog = async (): Promise<Catalog | undefined | null> => {
    const catalog = await useBffFetch<Catalog>("catalog");

    if (catalog) {
        catalog.stores?.forEach(s => {
            s.structuredData = s.structuredData ? JSON.parse(s.structuredData) : {};
            s.products.forEach(p => {
                p.structuredData = p.structuredData ? JSON.parse(p.structuredData) : {};
            })
        });

        const storeProducts = _.flatMap(catalog?.stores, "products");
        catalog.products = _.uniqBy(storeProducts, "id");
        return catalog;
    }
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
    return await getMediaUrlOrDefault(ppmi.uri, useAppConfig().defaults.thumbnail);
};

const expiration = 10 * 60;
const CatalogProductPrimaryMediaCachePrefix = "catalog:product-primary-media:";

export async function getProductPrimaryMediaUrl(product: Product, type: "thumbnail" | "image"): Promise<string> {
    const p = await useNuxtApp().$cache.getOrAcquire(`${CatalogProductPrimaryMediaCachePrefix}id=${product.id}_${type}`,
        async () => {
            const u = await acquireProductPrimaryMedia(product, type);

            if (type == "image") {
                useCatalogStore().setProductStructuredDataImage(product, u);
            }

            return u;
        }, expiration);
    return p as string;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
    var catalog = await getCatalog();
    if (!catalog || !catalog.products || catalog.products.length == 0) {
        return undefined;
    }
    return catalog.products.find(p => p.slug == slug);
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
        useCatalogStore().setCatalog(catalog);
        if (catalog.products) {
            useCartStore().updateCartProducts(catalog.products);
        }
    }
    return catalog;
}