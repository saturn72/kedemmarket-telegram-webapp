<template>
    <v-btn class="mt-7" @click="onClicked()">
        {{ $t('backToStore') }}
    </v-btn>
</template>

<script>
import { useVendorStore } from '@/stores/vendor';

export default {
    methods:
    {
        onClicked() {
            const route = useVendorStore().route ?? useAppConfig().defaults.storeRoute;
            this.$router.push(route);
        }
    }
}
</script>