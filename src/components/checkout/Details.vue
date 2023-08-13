<template>
    <v-dialog v-model="cartCalculationDialog">
        <v-card height="250">
            <v-card-text align="center" justify="center">
                <CheckoutCalculatingCart />
            </v-card-text>
        </v-card>
    </v-dialog>

    <v-dialog v-click-outside="resetRemoveFromCart" v-model="itemToDelete" width="auto" class="text-center"> <v-card>
            <v-card-text>{{ dialogText }}</v-card-text>
            <v-card-actions>
                <v-btn color="warning" @click="onConfirmRemoveFromCart">{{ $t('confirm') }}</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="resetRemoveFromCart">{{ $t('cancel') }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog persistent v-model="orderDialog" class="text-center">
        <v-card v-if="!orderPlaced" height="80%">
            <v-card-title>{{ $t('placingOrder') }}</v-card-title>
            <v-col class="d-flex justify-center">
                <v-progress-circular indeterminate :size="75" :width="5"></v-progress-circular>
            </v-col>
        </v-card>
        <v-card v-else loading fixed height="80%">
            <v-card-title>{{ $t('orderPlaced') }}</v-card-title>
            <v-card-subtitle>
                {{ $t('thankYouMessage') }}
            </v-card-subtitle>
            <v-card-text>
                {{ $t('youAreRedirectedToTheStore') }}
            </v-card-text>
            <v-card-actions>
                <AppBackToStoreButton block />
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-card class="mx-3 mt-3">
        <v-card-title>
            {{ $t('cartTotal') }}&nbsp;{{ $t('currencySymbol') }}{{ store.cartTotal }}
            <v-card-subtitle>
                {{ $t('pricesAfterDiscounts') }}
            </v-card-subtitle>
        </v-card-title>
        <CheckoutProductDetails v-for="item in store.items" :cartItem="item" @removeFromCart="removeFromCart(item)"
            @increment="incrementCartItem(item)" @decrement="decrementCartItem(item)">
        </CheckoutProductDetails>
    </v-card>
    <v-spacer></v-spacer>
    <p class="ma-6">
        <v-btn block :disabled="store.items.length == 0" color="secondary" @click="checkoutCart()">{{
            $t('checkoutCart')
        }}</v-btn>
    </p>
</template>

<script>
import _ from "lodash";
import { useCheckoutCartStore } from "@/stores/checkoutCart";
import { useCartStore } from "@/stores/cart";

export default {
    setup() {
        definePageMeta({
            layout: 'blank'
        });

        const store = computed(() => useCheckoutCartStore());
        useCheckoutCartStore().calculate(0);

        return {
            store
        };
    },
    async created() {
        this.cartCalculationDialog = true;
        this.cartCalculationDialog = false;
    },
    data() {
        return {
            itemToDelete: null,
            orderDialog: false,
            orderPlaced: false,
            cartCalculationDialog: false
        }
    },
    methods: {
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
        },
        resetRemoveFromCart() {
            this.itemToDelete = null;
        },
        incrementCartItem(item) {
            const userCart = useCartStore();
            userCart.incrementCartItem(item.product);
            item.orderedQuantity = userCart.getProductQuantity(item.product.id)
            item.loading = true;
        },
        decrementCartItem(item) {
            if (item.orderedQuantity == 1) {
                this.removeFromCart(item)
            }
            else {
                const userCart = useCartStore();
                userCart.decrementCartItem(item.product);
                item.orderedQuantity = userCart.getProductQuantity(item.product.id)
            }
            item.loading = true;
        },
    }
}
</script>
