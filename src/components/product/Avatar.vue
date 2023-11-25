<template>
    <v-avatar size="75" :image="src" :lazy-src="useAppConfig().defaults.thumbnail"></v-avatar>
</template>

<script>

import { getMediaUrlOrDefault } from "@/services/media";

export default {
    props: {
        product: { type: Object, default: {} },
    },
    async mounted() {
        this.src = await this.getThumbnailUrlAsync();
    },
    data: () => {
        src: ''
    },
    methods: {
        async getThumbnailUrlAsync() {
            const allThumbs = this.product.media.filter(m => m.type == "thumbnail");
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
            return await getMediaUrlOrDefault(primayThumb.uri, "thumbnail");
        }
    }
}
</script>
