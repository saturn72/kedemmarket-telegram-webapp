<template>
    <v-avatar :size="size" :image="src" :lazy-src="useAppConfig().defaults.thumbnail">
        <v-img>
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
    </v-avatar>
</template>

<script>
import { getProductPrimaryMediaUrl } from "@/services/catalog";

export default {
    props: {
        product: { type: Object, default: undefined },
        size: { type: Number, default: 75 }
    },
    async mounted() {
        this.src = await getProductPrimaryMediaUrl(this.product, "thumbnail");
        this.srcset = [this.src, await getProductPrimaryMediaUrl(this.product, "image")];
    },
    data: () => {
        return {
            src: undefined,
            srcset: []
        };
    }
}
</script>
