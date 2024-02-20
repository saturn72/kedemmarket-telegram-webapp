<template>
    <CheckoutEmpty v-if="items == 0"></CheckoutEmpty>
    <CheckoutDetails v-else></CheckoutDetails>
</template>

<script setup>
definePageMeta({
    middleware: ['auth'],
});
import { useCartStore } from '@/stores/cart'
import { usePageStore } from '@/stores/page'
import { computed } from 'vue'

const items = computed(() => useCartStore().getTotalCartItemsCount);
const header = useNuxtApp().$t(items > 1 ? 'carts' : 'cart');
usePageStore().setHeader(header);

</script>
