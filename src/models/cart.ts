import type { Product } from "./catalog";

export type CartItem = {
    product: Product;
    orderedQuantity: number;
    totalPrice?: number;
    addedOnUtc: Date;
    priceBeforeDiscounts?: number;
    priceAfterDiscounts?: number;
    numericDiscount?: number;
    percentageDiscount?: number;
}

export type Order = {
    orderId: any;
    items: CartItem[];
    orderTotal: number;
    totalDiscounts: number;
}
export type CartProductMessage =
    {
        from: Product,
        to: Product,
        diff: object,
        type?: string
    };

export type UserCart = {
    items: CartItem[]
    messages: (CartProductMessage)[]
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