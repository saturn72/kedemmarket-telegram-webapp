import { MediaItem } from "./common";

export interface Product {
    id: any;
    name: string;
    description: string;
    tags?: string[],
    price: number;
    tierPrices?: TierPrice[]
    image: MediaItem;
}

export interface VendorStore {
    id: any;
    name: string;
    logo?: MediaItem;
}

export interface Vendor {
    id: any;
    name: string;
    image?: MediaItem;
    store?: VendorStore;
    products?: Product[];
}

export interface Store {
    id: any;
    name: string;
    image?: string;
    vendors?: Vendor[];
}

export type TierPrice = {
    quantity: number,
    price: number,
    startDateTimeUtc?: Date
    endDateTimeUtc?: Date

}