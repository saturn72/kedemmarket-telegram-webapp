<template>
    <v-avatar :size="size" :image="images[0]" :lazy-src="useAppConfig().defaults.thumbnail">
        <v-img :height="size" :lazy-src="useAppConfig().defaults.thumbnail">
            <template #sources>
                <source :srcset="images">
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

export default {
    props: {
        images: { type: Array, default: () => [] },
        size: { type: Number, default: 75 }
    }
}
</script>
