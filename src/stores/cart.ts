import { defineStore } from 'pinia'
import { Product, Vendor } from '~/model';
import _, { forEach } from 'lodash';
import { useVendorStore } from './vendor';

type CartItem = {
    product: Product;
    orderedQuantity: number;
    addedOnUtc: Date
}

type VendorCart = {
    id: any,
    vendor: {
        id: any;
        name: string;
        image?: string | undefined;
    },
    items: CartItem[]
};

type CartState = {
    cartId?: any | undefined,
    vendorCarts: VendorCart[]
}

const findItem = (items: CartItem[] | undefined, productId: any): CartItem | undefined => {
    if (!items) {
        return undefined;
    }
    return items?.find((i: CartItem) => i.product.id === productId);
}

const getVendorCart = (state: CartState): VendorCart | undefined => {
    const v = useVendorStore().vendor;

    if (!v) {
        return undefined;
    }

    return state.vendorCarts?.find(vc => vc.id == v.id);
}

const getOrCreateVendorCart = (state: CartState): VendorCart => {
    let cart = getVendorCart(state);
    if (!cart) {
        const currentVendor = useVendorStore().vendor;
        if (!currentVendor) {
            throw Error("no vendor found");
        }

        const vendor = {
            id: currentVendor.id,
            name: currentVendor.name,
            image: currentVendor?.image,
        };

        const vendorCart: VendorCart = { id: vendor.id, vendor, items: [] };
        state.vendorCarts.push(vendorCart);
    }
    return getVendorCart(state) as VendorCart;
}

const incrementCartItemInternal = (cart: VendorCart, product: Product): void => {
    const existCartItem = findItem(cart.items, product.id);

    if (!existCartItem) {
        const ci = {
            product, orderedQuantity: 1, addedOnUtc: new Date(),
        };
        cart.items.push(ci);

    } else {
        existCartItem.orderedQuantity++;
    };
}

const decrementCartItemInternal = (cart: VendorCart, product: Product): void => {
    const ci = findItem(cart.items, product.id);
    if (!ci) {
        return;
    }

    if (ci.orderedQuantity > 0) {
        ci.orderedQuantity--;
        if (ci.orderedQuantity === 0) {
            _.remove(cart.items, (ci: CartItem) => ci.product.id === product.id);
        }
    }
}
export const useCartStore = defineStore('cart', {
    state: (): CartState => {
        return {
            vendorCarts: []
        };
    },
    getters: {

        cartItemCount(state): number {
            const cart = getVendorCart(state)
            if (!cart) {
                return 0;
            }

            let t = 0;
            cart.items?.forEach((ci: CartItem) => t += ci.orderedQuantity);
            return t;
        },

        vendorCartTotal(state): number {
            console.log("this is vct")
            const cart = getVendorCart(state);
            if (!cart) {
                return 0;
            }
            let total = 0;
            cart.items?.forEach((ci: CartItem) => total += ci.orderedQuantity * ci.product.price);
            return total;
        }
    },
    actions: {

        getProductQuantity(productId: any): number {
            const cart = getVendorCart(this.$state);
            if (!cart) {
                return 0;
            }

            const ci = findItem(cart.items, productId);
            return ci?.orderedQuantity || 0;
        },

        incrementCartItem(vendorCart: VendorCart, product: Product): void {
            const cart = this.$state.vendorCarts?.find(vc => vc.id == vendorCart.id);
            if (!cart) {
                return;
            }
            incrementCartItemInternal(cart, product);
        },

        decrementCartItem(vendorCart: VendorCart, product: Product): void {
            const cart = this.$state.vendorCarts?.find(vc => vc.id == vendorCart.id);
            if (!cart) {
                return;
            }
            decrementCartItemInternal(cart, product);
        },
        removeItemFromCart(vendorCart: VendorCart, product: Product): void {
            const cart = this.$state.vendorCarts?.find(vc => vc.id == vendorCart.id);
            if (!cart) {
                return;
            }

            const ci = findItem(cart.items, product.id);
            if (!ci) {
                return;
            }
            _.remove(cart.items, (ci: CartItem) => ci.product.id === product.id);
        },

        removeCarts(cartsToRemove: VendorCart[]): void {
            if (!cartsToRemove) {
                return;
            }

            const idsToRemove = cartsToRemove.map(c => c.id);
            _.remove(this.$state.vendorCarts, vc => _.indexOf(idsToRemove, vc.id) !== -1)
        },
        incrementVendorCartItem(product: Product): void {
            const cart = getOrCreateVendorCart(this.$state);
            incrementCartItemInternal(cart, product);
        },

        decrementVendorCartItem(product: Product): void {
            const cart = getOrCreateVendorCart(this.$state);
            if (!cart) {
                return;
            }
            decrementCartItemInternal(cart, product);
        },
    },
    persist: {
        storage: persistedState.localStorage
    }
})