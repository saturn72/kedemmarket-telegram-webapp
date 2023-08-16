<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="6" v-for="item in orders" :key="item.orderId">
                <v-card @click="onClick(item)" flat>
                    <v-card-title class="d-flex justify-center">
                        {{ $t('date') }} {{ item.date }}
                        <v-spacer></v-spacer>
                        {{ $t('total') }} {{ item.cartTotalDisplay }}
                    </v-card-title>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { getOrders } from "@/services/order";

export default {
    async created() {
        await this.fetchOrders()
    },
    methods: {
        async fetchOrders() {
            const res = await getOrders({
                pageSize: this.pageSize,
                skip: this.skip
            });

            this.orders = res.map(o => {
                return {
                    ...o,
                    date: (new Date(o.utcTimestamp)).toLocaleDateString(),
                    cartTotal: o.cartTotal,
                    cartTotalDisplay: `${o.cartTotal} ${this.$t('currencySymbol')}`
                }
            })
        },
        onClick(item) {
            const r = `${useAppConfig().routes.accountOrders}/${item.orderId}`;
            navigateTo(r);
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