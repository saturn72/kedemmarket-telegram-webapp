<template>
    <v-avatar :size="size" :image="src" :lazy-src="useAppConfig().defaults.thumbnail">
        <v-img>
            <template #sources>
                <source :srcset="srcset">
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
    mounted() {
        this.setSrc();
        this.setSrcset();
    },
    data: () => {
        return {
            src: useAppConfig().defaults.thumbnail,
            srcset: [useAppConfig().defaults.thumbnail]
        };
    },
    methods: {
        async setSrc() {
            this.src = await getProductPrimaryMediaUrl(this.product, "thumbnail");
        },
        async setSrcset() {
            this.srcset = [this.src, await getProductPrimaryMediaUrl(this.product, "image")];
        }
    }
}
</script>
