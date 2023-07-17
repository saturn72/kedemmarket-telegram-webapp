<template>
    <v-container>
        {{ carts }}
        <v-card>
            <v-card-subtitle>carts</v-card-subtitle>
        </v-card>
        <!-- <CartProductDetails v-for="cart in carts" :key="cart.id" :cartItem="cart" class="my-2">
        </CartProductDetails> -->
        <v-divider></v-divider>
    </v-container>
    <AppBackToStoreButton />
</template>
<script setup>
import { useCartStore } from '@/stores/cart'
import { computed } from 'vue'

const carts = computed(() => useCartStore().vendorCarts);
</script>