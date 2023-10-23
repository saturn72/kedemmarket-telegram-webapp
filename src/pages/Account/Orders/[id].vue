<template>
    <v-card :loading="loading">
        <v-card-text>

            <OrderDetails v-if="order" :order="order"></OrderDetails>
            <OrderNotExists v-else></OrderNotExists>
        </v-card-text>
    </v-card>
</template>

<script>
import { getOrderById } from '@/services/order';

export default {
    async created() {
        this.loading = true;
        const id = this.$route.params.id;
        this.order = await getOrderById(id);
        this.loading = false;
    },
    data() {
        return {
            order: {},
            loading: false
        }
    }
}
</script>