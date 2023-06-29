<template>
    <v-avatar class="mr-1 mt-1" color="grey" size="65">
        <v-img :src="src"></v-img>
    </v-avatar>
    <!-- <div>
        <v-img :src="src" :lazy-src="placeholder" v-bind:style="{ opacity: 0.8 }" class="align-stretch"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="60px">
        </v-img>
        <v-row class="text-center">
            <v-avatar class="mr-5 mt-n6" color="grey" size="65">
                <v-img :src="src"></v-img>
            </v-avatar>
        </v-row>
    </div> -->
</template>
<script>

// import mediaCache from "~/mediaCache";
// import { toServerUrl } from "~/mediaUtils";

export default {
    props:
    {
        product: { type: Object },
    },
    async created() {
        // if (this.product.media?.pictures.length > 0) {
        //     this.product.pictureUrl = toServerUrl(this.product.media.pictures[0].url);

        //     this.src = await mediaCache.get({
        //         key: this.product.pictureUrl,
        //         url: this.product.pictureUrl
        // });
        // }
    },
    data() {
        return {
            placeholder: "/logo-grayscale.jpg",
            src: "/logo.jpg",
        }
    }
}
</script>
