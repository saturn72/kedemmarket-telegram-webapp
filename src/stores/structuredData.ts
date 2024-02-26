import { defineStore } from 'pinia'
import type { Product } from '../models/catalog';

type ProductStructureDataInfo = { productId: any, image: string | undefined };
type StructureDataState = {
    value?: any | undefined,
    productsStructureDataState: ProductStructureDataInfo[]
}

const prepareProduct = (product: Product): void => {
    const urlPrefix = `https://${useAppConfig().routes.store}${useAppConfig().routes.product}`;
    product.structuredData.url = `${urlPrefix}/${product.slug}`;
}
const normalize = (value: any | undefined): string => {
    return value ? JSON.stringify(value)
        .replace('\"type\"', '\"@type\"')
        .replace('\'type\'', '\'@type\'')
        .replace('\"context\"', '\"@context\"')
        .replace('\'context\'', '\'@context\'')
        : "{}";
}

export const useStructuredDataStore = defineStore('structureData', {
    state: (): StructureDataState => ({ value: undefined, productsStructureDataState: [] }),
    actions: {
        clearValue() {
            this.$state.value = undefined;
        },
        setSingleProductPageStructuredData(product: Product): void {
            prepareProduct(product)
            const sd = normalize(product.structuredData);
            this.$state.value = sd;
        },
        setMultipleProductPageStructuredData(products: Product[]): void {
            let i = 1;
            const psdObj = products.map((p: Product) => {
                prepareProduct(p)
                return {
                    "@type": "ListItem",
                    "position": i++,
                    "item": p.structuredData
                };
            });

            const sdObj = {
                "@context": "https://schema.org/",
                "@type": "ItemList",
                "itemListElement": psdObj
            };

            var sd = normalize(sdObj)
            this.$state.value = sd;
        }
    },
});