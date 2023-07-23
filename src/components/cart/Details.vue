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

    <v-dialog persistent v-model="orderDialog" class="text-center">
        <v-card v-if="!orderPlaced">
            <v-card-title>{{ $t('placingOrder') }}</v-card-title>
            <v-col class="d-flex justify-center">
                <v-progress-circular indeterminate :size="75" :width="5"></v-progress-circular>
            </v-col>
        </v-card>
        <v-card v-else loading fixed>
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

    <v-container>
        <p class="mb-3">
            <v-btn block size="small" :disabled="cartItems == 0" color="secondary" @click="checkoutCart()">{{
                $t('checkoutCart')
            }}</v-btn>
        </p>
        <CartProductDetails v-for="item in cartItems" :cartItem="item" @removeFromCart="removeFromCart(item)"
            @increment="incrementCartItem(item)" @decrement="decrementCartItem(item)">
        </CartProductDetails>
    </v-container>
</template>
<script setup>
import { useCartStore } from '@/stores/cart'
import { computed } from 'vue'

const cartItems = computed(() => useCartStore().items?.filter(c => c.orderedQuantity > 0));

</script>
<script>

import { useCartStore } from "@/stores/cart";

export default {
    data() {
        return {
            itemToDelete: null,
            orderDialog: false,
            orderPlaced: false,
        }
    },
    methods: {
        removeFromCart(item) {
            const t = this.$t('deleteFromCart');
            this.dialogText = t.replace("##0##", item.product.name)
            this.itemToDelete = item;
        },
        onConfirmRemoveFromCart() {
            useCartStore().removeItemFromCart(this.itemToDelete.product);
            this.resetRemoveFromCart();
        },
        resetRemoveFromCart() {
            this.itemToDelete = null;
        },
        incrementCartItem(item) {
            useCartStore().incrementCartItem(item.product);
        },
        decrementCartItem(item) {
            if (item.orderedQuantity == 1) {
                this.removeFromCart(item)
            }
            else {
                useCartStore().decrementCartItem(item.product);
            }
        },
        async checkoutCart() {
            this.orderDialog = true;
            await this.$backend.placeOrder(useCartStore());
            this.orderPlaced = true;

            setTimeout(function () {
                useCartStore().$reset()
                useRouter().push('/')
            }, 3000);
        }
    }
}
</script>