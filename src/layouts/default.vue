<template>
    <v-app>
        <AppHeader />
        <v-main>
            <p v-if="header" justify-center class="text-subtitle-1 mx-7">{{ header }}</p>
            <slot />
        </v-main>
        <AppSnackbar />
        <AppFooter />
    </v-app>
</template>

<script setup>
const store = useStructuredDataStore();
const textContent = computed(() => store.value);

const header = usePageStore().header;
useHeadSafe({
    titleTemplate: (titleChunk) => {
        const title = useNuxtApp().$t('kedemmarket');
        return titleChunk ? `${title} - ${titleChunk}` : title;
    },
    script: [{
        type: "application/ld+json",
        textContent
    }],
});
</script>