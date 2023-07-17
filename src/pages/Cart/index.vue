<template>
    <CartEmpty v-if="carts.length == 0"></CartEmpty>
    <CartDetails v-else></CartDetails>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
import { computed } from 'vue'

const carts = computed(() => useCartStore().vendorCarts);
</script>
