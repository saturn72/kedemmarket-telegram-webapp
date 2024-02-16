
<template>
    <ProductProfile :product="product" :loading="loading"></ProductProfile>
</template>
  
<script>
import { getProductBySlug } from "@/services/catalog";

export default {
    async mounted() {
        this.loading = true;
        const slug = useRoute().params.slug;
        if (slug) {
            this.product = await getProductBySlug(slug);
        }

        useStructuredDataStore().setValue(this.product.structuredData);
        this.loading = false;
    },
    data: () => {
        return {
            product: undefined,
            loading: false,
        }
    }
}
</script>