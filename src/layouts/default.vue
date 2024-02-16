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
store.$subscribe((mutation, state) => {
    useHead({
        script: [{
            id: 'structured-data',
            type: "application/ld+json",
            textContent: () => state.value,
        }],
    });
})

useHead({
    titleTemplate: (titleChunk) => {
        const title = useNuxtApp().$t('kedemmarket');
        return titleChunk ? `${title} - ${titleChunk}` : title;
    },
});

const header = usePageStore().header;
</script>