<template>
    <CartEmpty v-if="carts.length == 0"></CartEmpty>
    <CartDetails v-else></CartDetails>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
import { usePageStore } from '@/stores/page'
import { computed } from 'vue'

const carts = computed(() => useCartStore().vendorCarts?.filter(c => c.items?.length > 0)) ?? [];

const header = useNuxtApp().$t(carts.length > 1 ? 'carts' : 'cart');
usePageStore().setHeader(header);
</script>
