<template>
    <v-avatar size="75" :image="product.image?.url" :lazy-src="useAppConfig().defaults.thumbnail"></v-avatar>
</template>
<script>
export default {
    props: {
        product: { type: Object, default: {} },
    },
}
</script>
