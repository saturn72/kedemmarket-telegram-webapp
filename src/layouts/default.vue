<template>
    <v-app>
        <AppHeader />
        <v-main>
            <!-- <v-dialog :model-value="dialog">
                <template v-slot:activator="{ props }"> -->
            <p v-if="header" justify-center class="text-subtitle-1 mx-7">{{ header }}</p>
            <slot />
            <!-- 
        </template>
            <template v-slot:default>
                    <v-card v-click-outside="clearDialog">
                        <v-card-text>
                            <component :is="useAlertStore().$state.component" v-bind="{ ...useAlertStore().$state.props }" />
                            {{ useAlertStore().$state.component }} 
        </v-card-text>
        </v-card>
        </template>
        </v-dialog> -->
        </v-main>
        <AppSnackbar />
        <AppFooter />
    </v-app>
</template>

<script setup>
import { usePageStore } from '@/stores/page';
// import { useAlertStore } from '@/stores/alert';

const header = usePageStore().header;
// const alertStore = useAlertStore();
// const dialog = computed(() => {
//     return alertStore.$state.type == "dialog";
// });
</script>
<!-- <script>
export default
    {
        methods: {
            clearDialog() {
                useAlertStore().clearAlarmType("dialog");
            }
        }
    }
</script> -->