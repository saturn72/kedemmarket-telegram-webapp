<template>
    <v-card-title>
        <!-- <v-img :alt="store.name" :src="src" :lazy-src="placeholder" v-bind:style="{ opacity: 0.2 }"
                class="align-stretch" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" height="60px">
            </v-img> -->
        <v-avatar color="grey" size="65">
            <v-img :src="src" :alt="store.name"></v-img>
        </v-avatar>
        <p class="mx-2">
            {{ store.name }}
        </p>
    </v-card-title>
</template>
<script>

// import mediaCache from "~/mediaCache";
// import { toServerUrl } from "~/mediaUtils";

export default {
    props:
    {
        store: { type: Object },
    },
    async created() {
        if (this.store.pictureUrl) {
            this.store.pictureUrl = toServerUrl(this.store.pictureUrl);

            this.src = await mediaCache.get({
                key: this.store.pictureUrl,
                url: this.store.pictureUrl
            });
        }
    },
    data() {
        return {
            placeholder: "/logo-grayscale.jpg",
            src: "/logo.jpg",
        }
    }
}
</script>
