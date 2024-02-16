<template>
    <v-card v-for="item in cartItems" @removeFromCart="removeFromCart(item)" flat :loading="item.loading">
        <v-card-text>
            <v-row>
                <v-col cols="4" justify-center class="text-subtitle-2 my-4 ml-4">
                    <v-row>
                        <ProductAvatar :images="getImages(item)"></ProductAvatar>
                    </v-row>
                    <v-row>
                        {{ $t("unitPrice") }}&nbsp;<strong>{{ item.priceAfterDiscounts }}</strong>
                        &nbsp;{{ $t('currencySymbol') }}
                    </v-row>
                </v-col>
                <v-col class="text-subtitle-2 flex-column justify-right">
                    <v-row>
                        {{ item.product.name }}
                    </v-row>
                    <v-row>
                        {{ $t("itemTotal") }}
                        <strong>{{ item.cartTotal }}</strong>&nbsp;{{
                            $t('currencySymbol') }}
                    </v-row>
                    <v-row>
                        <v-card-actions>
                            <v-btn icon="mdi-minus" @click="decrementCartItem(item)"></v-btn>
                            {{ item.orderedQuantity }}
                            <v-btn icon="mdi-plus" @click="incrementCartItem(item)"></v-btn>
                        </v-card-actions>
                    </v-row>
                </v-col>
            </v-row>
            <v-divider></v-divider>
        </v-card-text>
    </v-card>
</template>

<script setup>

useCheckoutCartStore().calculate(0);
const cartItems = computed(() => useCheckoutCartStore().items);

</script>
<script>
import { useCheckoutCartStore } from "@/stores/checkoutCart";
import { useCartStore } from "@/stores/cart";

export default {
    data() {
        return {
            itemToDelete: null,
            orderDialog: false,
        }
    },
    methods: {
        incrementCartItem(item) {
            useCartStore().incrementCartItem(item.product);
            this.updateCheckoutCart(item);
        },
        decrementCartItem(item) {
            if (item.orderedQuantity == 1) {
                this.$emit('removeFromCart', item);
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
    },
}
</script>
