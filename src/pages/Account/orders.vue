<template>
    this is orders page

    {{ orders }}
</template>

<script>
import { getOrders } from "@/services/order";

export default {
    async created() {
        await this.fetchOrders()
    },
    methods: {
        async fetchOrders() {
            this.orders = await getOrders({
                pageSize: this.pageSize,
                skip: this.skip
            });
        }
    },
    data() {
        return {
            orders: [],
            pageSize: 10,
            skip: 0
        };
    }
}
</script>