<template>
    <v-btn @click="onClicked()" variant="outlined">
        {{ $t('backToStore') }}
    </v-btn>
</template>

<script>
import { useVendorStore } from '@/stores/vendor';

export default {
    methods:
    {
        onClicked() {
            const route = useVendorStore().route ?? useAppConfig().routes.home;
            this.$router.push(route);
        }
    }
}
</script>