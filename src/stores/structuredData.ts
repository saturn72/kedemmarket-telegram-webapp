import { defineStore } from 'pinia'
import type { Product } from '~/models/catalog'

type ProductStructureDataInfo = { productId: any, image: string | undefined };
type StructureDataState = {
    value?: any | undefined,
    productsStructureDataState: ProductStructureDataInfo[]
}

const normalize = (value: string | undefined): string => {
    const n = value ? JSON.stringify(value)
        .replaceAll('\"type\"', '\"@type\"')
        .replaceAll('\'type\'', '\'@type\'')
        .replaceAll('\"context\"', '\"@context\"')
        .replaceAll('\'context\'', '\'@context\'')
        : "{}";

    return JSON.parse(n);
}

export const useStructuredDataStore = defineStore('structure-Data', {
    state: (): StructureDataState => ({ value: undefined, productsStructureDataState: [] }),
    actions: {
        clearValue() {
            this.$state.value = undefined;
        },
        setCatalogStructuredData(products: Product[], updateValue: boolean = true): void {
            const urlPrefix = `https://${useAppConfig().routes.store}${useAppConfig().routes.product}`;

            let i = 1;
            const psdObj = products.map((p: Product) => {
                const sd = normalize(p.structuredData);
                const sdObj = JSON.parse(sd);
                sdObj.url = `${urlPrefix}/${p.slug}`;

                return {
                    "@type": "ListItem",
                    "position": i++,
                    "item": sdObj
                };
            });

            // const psd = JSON.stringify(psdObj);
            const sd = {
                "@context": "https://schema.org/",
                "@type": "ItemList",
                "itemListElement": psdObj
            };

            if (updateValue) {
                this.$state.value = JSON.stringify(sd);
            }
        },

        setProductStructuredDataImage(product: Product, url: string) {

        },
    },
});