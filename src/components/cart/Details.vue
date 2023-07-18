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

    <v-dialog persistent v-model="placingOrder" width="300" class="text-center">
        <v-card>
            <v-card-title>{{ $t('placeingOrder') }}</v-card-title>
            <v-col class="d-flex justify-center">
                <v-progress-circular indeterminate :size="75" :width="5"></v-progress-circular>
            </v-col>
        </v-card>
    </v-dialog>

    <v-container>
        <p class="mb-3">
            <v-btn block size="small" :disabled="carts.length == 0" color="secondary" @click="checkoutCart()">{{
                carts.length > 1 ?
                $t('checkoutAllCarts') :
                $t('checkoutCart')
            }}</v-btn>
        </p>
        <v-card v-for="cart in carts" :key="cart.id" tile class="mb-5">
            <v-card-title>
                <v-row class="my-1">
                    <v-col>
                        <v-avatar class="ml-2" size="large" :lazy-src="useAppConfig().defaults.thumbnail"
                            :image="cart.vendor?.image"></v-avatar>
                        {{ cart.vendor.name }}
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col>
                        <v-btn size="small" color="secondary" @click="checkoutCart(cart)">{{ $t('checkoutCart') }}</v-btn>
                    </v-col>
                </v-row>
            </v-card-title>
            <v-divider></v-divider>

            <CartProductDetails v-for="item in cart.items" :cart-item="item" @removeFromCart="removeFromCart(cart, item)"
                @increment="incrementCartItem(cart, item)" @decrement="decrementCartItem(cart, item)">
            </CartProductDetails>
        </v-card>
    </v-container>
</template>
<script setup>
import { useCartStore } from '@/stores/cart'
import { computed } from 'vue'

const carts = computed(() => useCartStore().vendorCarts?.filter(c => c.items?.length > 0)) ?? [];

</script>
<script>
export default {
    data() {
        return {
            itemToDelete: null,
            cartToDeleteFrom: null,
            placingOrder: false,
        }
    },
    methods: {
        removeFromCart(cart, item) {
            const t = this.$t('deleteFromCart');
            this.dialogText = t.replace("##0##", item.product.name)
            this.itemToDelete = item;
            this.cartToDeleteFrom = cart;
        },
        onConfirmRemoveFromCart() {
            useCartStore().removeItemFromCart(this.cartToDeleteFrom, this.itemToDelete.product);
            this.resetRemoveFromCart();
        },
        resetRemoveFromCart() {
            this.cartToDeleteFrom = null
            this.itemToDelete = null;
        },
        incrementCartItem(cart, item) {
            useCartStore().incrementCartItem(cart, item.product);
        },
        decrementCartItem(cart, item) {
            if (item.orderedQuantity == 1) {
                this.removeFromCart(cart, item)
            }
            else {
                useCartStore().decrementCartItem(cart, item.product);
            }
        },
        checkoutCart(cart) {
            const orderCarts = cart ? [cart] : useCartStore().vendorCarts?.filter(c => c.items?.length > 0);
            this.placingOrder = true;
            this.$backend.placeOrder(orderCarts);
        }
    }
}
</script>