<template>
    <v-app dir="rtl">
        <AppHeader />

        <v-main>
            <p v-if="header" justify-center class="text-subtitle-1 mx-7">{{ header }}</p>
            <slot />
        </v-main>
        <AppFooter />
    </v-app>
</template>

<script setup>

import { usePageStore } from '@/stores/page';
const header = usePageStore().header;
</script>

  