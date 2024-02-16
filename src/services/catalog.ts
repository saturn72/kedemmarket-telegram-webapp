import type { Catalog, Product } from "@/models/catalog";
import { useCartStore } from "@/stores/cart";
import _ from "lodash";
import { getMediaUrlOrDefault } from "./media";

const acquireCatalog = async (): Promise<Catalog | undefined | null> => {
    const url = await useNuxtApp().$storage.getDownloadUrl(`catalog/index.json`);
    if (!url) {
        return undefined;
    }

    const catalog = await $fetch<Catalog>(url);
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

<<<<<<< HEAD
const acquireProductPrimaryMedia = async (product: Product, type: "thumbnail" | "image"): Promise<string> => {
=======
const acquireProductMedia = async (product: Product, type: "thumbnail" | "image", imageIndex: number): Promise<string> => {
>>>>>>> b9c2dc34cff96266c40817d31c3f0ab4b159e1a7
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
<<<<<<< HEAD
        async () => {
            const u = await acquireProductPrimaryMedia(product, type);

            if (type == "image") {
                useCatalogStore().setProductStructuredDataImage(product, u);
            }

            return u;
        }, expiration);
=======
        () => acquireProductMedia(product, type, index), expiration);
>>>>>>> b9c2dc34cff96266c40817d31c3f0ab4b159e1a7
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
    console.log("ttttttt", catalog);
    return catalog;
}