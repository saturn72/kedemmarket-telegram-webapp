<template>
    <v-row>
        <v-col justify-center>
            <v-btn @click="onClicked()" variant="outlined">
                {{ $t('backToStore') }}
            </v-btn>
        </v-col>
    </v-row>
</template>

<script>
import { useVendorStore } from '@/stores/vendor';

export default {
    methods:
    {
        onClicked() {
            const route = useVendorStore().route ?? useAppConfig().routes.postPurchaseRoute;
            this.$router.push(route);
        }
    }
}
</script>