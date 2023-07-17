<template>
    <v-app-bar flat>
        <v-app-bar-title>
            <v-card>
                <template v-slot:image>
                    <v-img style=" opacity:0.35" cover :src="vendor?.image ?? useAppConfig().defaults.thumbnail"></v-img>
                </template>
                <template v-slot:append>
                    <v-avatar size="55" :lazy-src="useAppConfig().defaults.thumbnail" :image="vendor?.image"></v-avatar>
                </template>
                <template v-slot:title>
                    {{ vendor?.store.name }}
                </template>
                <template v-slot:subtitle>
                    {{ vendor?.name }}
                </template>
            </v-card>
        </v-app-bar-title>
    </v-app-bar>
</template>

<script setup>
import { useVendorStore } from '@/stores/vendor'
import { computed } from 'vue'
const vendor = computed(() => useVendorStore().vendor);
const route = computed(() => useVendorStore().route);
</script>