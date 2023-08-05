<template>
    <CartEmpty v-if="items == 0"></CartEmpty>
    <CartDetails v-else></CartDetails>
</template>

<script setup>

import { useCartStore } from '@/stores/cart'
import { usePageStore } from '@/stores/page'
import { computed } from 'vue'

const items = computed(() => useCartStore().getCartItemCount);

const header = useNuxtApp().$t(items > 1 ? 'carts' : 'cart');
usePageStore().setHeader(header);
</script>
