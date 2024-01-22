<template>
    <v-img :src="src" :lazy-src="useAppConfig().defaults.logo">
        <template #sources>
            <source :srcset="srcset">
        </template>
        <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
                <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
            </div>
        </template>
        <template v-slot:error>
            <v-img :src="useAppConfig().defaults.thumbnail">
            </v-img>
        </template>
    </v-img>
</template>
<script>
import { useCartStore } from '@/stores/cart'
import { getProductPrimaryMediaUrl } from "@/services/catalog";

export default {
    props: {
        product: { type: Object, default: {} },
        loading: { type: Boolean, default: false }
    },
    watch: {
        async product() {
            this.src = await getProductPrimaryMediaUrl(this.product, "image");
            this.srcset = [this.src];
        }
    },
    computed: {
        qty() {
            return useCartStore().getProductQuantity(this.product.id);
        }
    },
    data: () => {
        return {
            src: undefined,
            srcset: []
        };
    }
}
</script>
