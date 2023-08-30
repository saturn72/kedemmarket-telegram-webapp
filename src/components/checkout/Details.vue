<template>
    <v-dialog v-click-outside="resetRemoveFromCart" v-model="itemToDelete" width="auto" class="text-center"> <v-card>
            <v-card-text>{{ dialogText }}</v-card-text>
            <v-card-actions>
                <v-btn color="warning" @click="onConfirmRemoveFromCart">{{ $t('confirm') }}</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="resetRemoveFromCart">{{ $t('cancel') }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <CheckoutOrderDialog :show="orderDialog"></CheckoutOrderDialog>

    <v-card height="100%" flat class="d-flex flex-column justify-center">
        <v-card-title v-if="loading || calculating" class="d-flex flex-column align-center justify-center">
            <v-progress-circular indeterminate width="1"></v-progress-circular>
        </v-card-title>
        <v-card-title v-else>
            {{ $t('cartTotal') }}&nbsp;{{ $t('currencySymbol') }}{{ store.cartTotal }}
            <v-card-subtitle>
                {{ $t('pricesAfterDiscounts') }}
            </v-card-subtitle>
        </v-card-title>

        <v-card-text>
            <CheckoutProductDetails v-for="item in store.items" :cartItem="item" @removeFromCart="removeFromCart(item)"
                @increment="incrementCartItem(item)" @decrement="decrementCartItem(item)">
            </CheckoutProductDetails>
        </v-card-text>

        <v-card-actions>
            <v-btn block variant="flat" :loading="loading || calculating" :disabled="loading || store.items.length == 0"
                color="secondary" @click="checkout()">{{
                    $t('checkoutCart')
                }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import _ from "lodash";
import { useCheckoutCartStore } from "@/stores/checkoutCart";
import { useCartStore } from "@/stores/cart";
import { submitOrder } from "@/services/checkout";

export default {
    setup() {
        const store = computed(() => useCheckoutCartStore());

        const loading = computed(() => {
            const items = useCheckoutCartStore().items;
            return items && items.some(i => i.loading);
        });

        const calculating = computed(() => useCheckoutCartStore().calculating || false);
        useCheckoutCartStore().calculate(0);

        return {
            store,
            loading,
            calculating
        };
    },

    data() {
        return {
            itemToDelete: null,
            orderDialog: false,
        }
    },
    methods: {
        async checkout() {
            this.orderDialog = true;
            const order = await submitOrder();
            const ro = encodeURIComponent(JSON.stringify(order));
            const r = `${useAppConfig().routes.postPurchaseRoute}?order=${ro}`;
            useRouter().push(r)
        },

        removeFromCart(item) {
            const t = this.$t('deleteFromCart');
            this.dialogText = t.replace("##0##", item.product.name)
            this.itemToDelete = item;
        },
        onConfirmRemoveFromCart() {
            const userCart = useCartStore();
            userCart.removeItemFromCart(this.itemToDelete.product);
            _.remove(useCheckoutCartStore().items,
                i => i.product.id == this.itemToDelete.product.id);

            this.resetRemoveFromCart();
            useCheckoutCartStore().calculate(2000);
        },
        resetRemoveFromCart() {
            this.itemToDelete = null;
        },

        incrementCartItem(item) {
            useCartStore().incrementCartItem(item.product);
            this.updateCheckoutCart(item);
        },

        decrementCartItem(item) {
            if (item.orderedQuantity == 1) {
                this.removeFromCart(item)
            }
            else {
                useCartStore().decrementCartItem(item.product);
                this.updateCheckoutCart(item);
            }
        },

        updateCheckoutCart(item) {
            item.orderedQuantity = useCartStore().getProductQuantity(item.product.id)
            item.loading = true;
            useCheckoutCartStore().calculate(2000);
        }
    }
}
</script>
