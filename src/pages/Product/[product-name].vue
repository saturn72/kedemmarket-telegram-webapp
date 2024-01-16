
<template>
    <span>Product name: {{ $route.params['product-name'] }}</span>
    <span>Product ID: {{ $route.params['product-id'] }}</span>
</template>
  
<script setup>
const route = useRoute()
console.log(route.params) // { id: '123' }
console.log(route.query) // { id: '123' }
</script>