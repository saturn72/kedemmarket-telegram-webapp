<template>
    {{ product }}
</template>
<script>
import { getProductBySlug } from "@/services/catalog";

export default {
    async mounted() {
        const slug = useRoute().params.slug;
        this.loading = true;
        this.product = await getProductBySlug(slug);
        this.loading = false;
    },
    data: () => {
        return {
            loading: false,
            product: {}
        };
    }
}
</script>