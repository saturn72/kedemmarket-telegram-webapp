<template>
    <v-app-bar flat>
        <template v-slot:image>
            <v-img style=" opacity:0.35" cover :src="vendor?.image ?? useAppConfig().defaults.thumbnail"></v-img>
        </template>

        <template v-slot:append>
            <v-btn variant='outlined' density="compact" icon="mdi-arrow-left" @click="$router.back()"></v-btn>
        </template>

        <template v-slot:prepend>
            <v-avatar size="55" :lazy-src="useAppConfig().defaults.thumbnail" :image="vendor?.image"></v-avatar>
        </template>

        <template v-slot:title>
            {{ vendor?.store.name }}
        </template>
        <template v-slot:subtitle>
            {{ vendor?.name }}
        </template>
    </v-app-bar>
</template>

<script setup>
import { useVendorStore } from '@/stores/vendor'
import { computed } from 'vue'
const vendor = computed(() => useVendorStore().vendor);
</script>