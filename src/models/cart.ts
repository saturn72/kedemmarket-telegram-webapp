import { Product } from "./catalog";

export type CartItem = {
    product: Product;
    orderedQuantity: number;
    totalPrice?: number;
    addedOnUtc: Date;
}

export type Order = {
    orderId: any;
    items: CartItem[];
    orderTotal: number;
    totalDiscounts: number;
}

export type UserCart = {
    items: CartItem[]
};

export type CheckoutCartItem = CartItem & {
    cartTotal: number;
    itemPrice: number;
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