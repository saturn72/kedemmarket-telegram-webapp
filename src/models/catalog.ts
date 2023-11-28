import type { MediaItem } from "@/models/common";

export interface Catalog {
    createdOnUtc: Date;
    version: string;
    stores?: Store[];
}

export interface Store {
    id: any;
    name: string;
    logoThumb?: MediaItem;
    logoPicture?: MediaItem;
    products: Product[];
    vendors?: Vendor[];
}

export interface Product {
    id: any;
    allowedQuantities: string;
    categories: string[];
    displayOrder: number;
    fullDescription: string;
    gtin: string;
    height: number;
    isNew: boolean;
    isShipEnabled: Boolean;
    length: number;
    manufacturers: string[],
    media: MediaItem[],
    mpn: string;
    name: string;
    oldPrice: number;
    orderMaximumQuantity: number;
    orderMinimumQuantity: number;
    parentGroupedProductId: any;
    price: number;
    productType: string;
    quantity: number;
    rating: number;
    reviews: number;
    shippingCost: number;
    shortDescription: string;
    sku: string;
    tags?: string[],
    tierPrices?: TierPrice[]
    vendor: Vendor;
    visibleIndividually: Boolean;
    weight: number;
    width: number;
}

export interface Vendor {
    id: any;
    name: string;
    logo?: MediaItem;
    // store?: VendorStore;
    // products?: Product[];
}

// export interface VendorStore {
//     id: any;
//     name: string;
//     logo?: MediaItem;
// }

export type TierPrice = {
    quantity: number,
    price: number,
    startDateTimeUtc?: Date
    endDateTimeUtc?: Date
}
