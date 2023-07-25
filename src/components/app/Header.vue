<template>
    <v-app-bar flat>
        <template v-slot:image>
            <v-img style=" opacity:0.35" cover :src="useAppConfig().defaults.thumbnail"></v-img>
        </template>

        <template v-slot:append>
            <v-btn variant='outlined' density="compact" icon="mdi-arrow-left" @click="$router.back()"></v-btn>
        </template>

    </v-app-bar>
</template>
