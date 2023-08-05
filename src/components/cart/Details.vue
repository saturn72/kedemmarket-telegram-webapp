<template>
    <v-dialog v-model="cartCalculationDialog">
        <v-card height="250">
            <v-card-text align="center" justify="center">

                <CartCalculatingCart />
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
            {{ $t('cartTotal') }}&nbsp;{{ $t('currencySymbol') }}{{ useCartStore().getCartTotal }}
        </v-card-title>

        <CartProductDetails v-for="item in items" :cartItem="item" @removeFromCart="removeFromCart(item)"
            @increment="incrementCartItem(item)" @decrement="decrementCartItem(item)">
        </CartProductDetails>
    </v-card>
    <v-spacer></v-spacer>
    <p class="ma-6">
        <v-btn block :disabled="items == 0" color="secondary" @click="checkoutCart()">{{
            $t('checkoutCart')
        }}</v-btn>
    </p>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
import { computed } from 'vue'

const tttt = await useCartStore().calculateCart;
console.log("tttt", tttt)
const items = computed(() => useCartStore().getUserCart.items?.filter(c => c.orderedQuantity > 0));

definePageMeta({
    layout: 'blank'
});

</script>

<script>
import { useCartStore } from "@/stores/cart";

export default {
    mounted() {
        setTimeout(() => this.cartCalculationDialog = false, 3000)
    },
    data() {
        return {
            itemToDelete: null,
            orderDialog: false,
            orderPlaced: false,
            cartCalculationDialog: true
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
            const cart = useCartStore().getUserCart
            await this.$backend.placeOrder(cart);
            this.orderPlaced = true;

            setTimeout(function () {
                useCartStore().setCart({ items: [] });
                useRouter().push(useAppConfig().routes.postPurchaseRoute)
            }, 3000);
        }
    }
}
</script>