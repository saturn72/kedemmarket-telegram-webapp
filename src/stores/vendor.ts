import { defineStore } from 'pinia'
import { Product, Vendor } from '~/model';
import { useRoute } from 'vue-router'
import { useNuxtApp } from 'nuxt/app';

const getThumbnailUrl = async (src: string): Promise<string> => {
    const url = await useNuxtApp().$storage.getDownloadUrl(src);
    return (url || useAppConfig().defaults.thumbnail) as string;
};

const acquireVendor = async (key: string): Promise<Vendor | undefined | null> => {
    const url = await useNuxtApp().$storage.getDownloadUrl(`catalog/${key}.json`);
    if (!url) {
        return undefined;
    }
    const v = await $fetch<any>(url);

    const products: Product[] = [];
    if (v.products) {
        for (let index = 0; index < v.products.length; index++) {
            const p = v.products[index];
            const tn = p.media?.find((m: any) => m.type == "thumbs") ||
                p.media?.find((m: any) => m.displayOrder == 0);
            const url = await getThumbnailUrl(tn.uri);

            products.push({
                id: p.id,
                name: p.name,
                description: p.shortDescription,
                price: p.price,
                image: {
                    alt: tn.alt || p.name,
                    src: (tn.uri || useAppConfig().defaults.thumbnail) as string,
                    title: (tn.title ?? p.name) as string,
                    url
                }
            });
        }
    }

    const image = v.log ?
        await getThumbnailUrl(v.logo.uri) :
        useAppConfig().defaults.logo;

    return {
        id: v.id,
        name: v.name,
        image,
        store: {
            id: v.store.id,
            name: v.store.name,
        },
        products,
    };
}

type VendorState = {
    vendor?: Vendor | undefined,
    route?: string
}

export const useVendorStore = defineStore('vendor', {
    state: (): VendorState => { return { vendor: undefined } },
    actions: {
        async setVendor(): Promise<void> {
            const params = useRoute().params;
            const route = `${params.storeId}/${params.vendor}`;
            this.route = '/' + route;
            const data = await useNuxtApp().$cache.getOrAcquire(`vandor:${route}`, () => acquireVendor(route), 10 * 60);
            if (data) {
                this.vendor = data;
            }
        },
    },
})