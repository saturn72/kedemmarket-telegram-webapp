import { type } from "os";

export interface MediaItem {
    alt: string;
    src: string;
    title: string;
    url: string;
}
export type TierPrice = {
    quantity: number,
    price: number,
    startDateTimeUtc?: Date
    endDateTimeUtc?: Date

}
export type CartItem = {
    product: Product;
    orderedQuantity: number;
    totalPrice?: number;
    addedOnUtc: Date;
}

export type UserCart = {
    items: CartItem[]
};

export type CheckoutCartItem = CartItem & {
    itemPrice: number;
    cartTotal: number;
    numericDiscount: number;
    percentageDiscount: number;
    priceAfterDiscounts: number;
    priceBeforeDiscounts: number;
};

export type CheckoutCart = {
    userCart: UserCart | undefined,
    items: CheckoutCartItem[]
    cartTotal: number;
    totalDiscounts: number;
}

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