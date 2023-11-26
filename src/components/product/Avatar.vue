<template>
    <v-avatar size="75" :image="src" :lazy-src="useAppConfig().defaults.thumbnail">
        <v-img>
            <template #sources>
                <source :srcset="srcset">
            </template>
        </v-img>
    </v-avatar>
</template>

<script>
import { getMediaUrlOrDefault } from "@/services/media";

export default {
    props: {
        product: { type: Object, default: undefined },
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
            this.src = await this.getProductImage("thumbnail");
        },
        async setSrcset() {
            this.srcset = [this.src, await this.getProductImage("image")];
        },
        async getProductImage(type) {
            if (!this.product) {
                return useAppConfig().defaults.thumbnail;
            }
            const allThumbs = this.product.media.filter(m => m.type == type);
            if (allThumbs.length == 0) {
                return useAppConfig().defaults.thumbnail;
            }

            let primayThumb = allThumbs[0];
            for (let index = 1; index < allThumbs.length; index++) {
                const c = allThumbs[index];
                if (c.displayOrder < primayThumb.displayOrder) {
                    primayThumb = c;
                }
            }
            return await getMediaUrlOrDefault(primayThumb.uri, type);
        }
    }
}
</script>
