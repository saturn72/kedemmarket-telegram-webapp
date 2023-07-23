<template>
    <CartEmpty v-if="cartItems == 0"></CartEmpty>
    <CartDetails v-else></CartDetails>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
import { usePageStore } from '@/stores/page'
import { computed } from 'vue'

const cartItems = computed(() => useCartStore().getCartItemCount);

const header = useNuxtApp().$t(cartItems > 1 ? 'carts' : 'cart');
usePageStore().setHeader(header);
</script>
