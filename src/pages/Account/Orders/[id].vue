<template>
    <v-card :loading="loading">
        <OrderNotExist :show="!orderExist"></OrderNotExist>
        <v-card-text>
            <OrderDetails :order="order"></OrderDetails>
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
        this.orderExist = this.order && this.order != null;
        this.loading = false;
    },
    data() {
        return {
            order: {},
            loading: false,
            orderExist: true,
        }
    }
}
</script>