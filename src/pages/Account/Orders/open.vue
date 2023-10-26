<template>
    <v-card :loading="loading" :disabled="loading" height="100%" flat class="d-flex flex-column justify-center">
        <v-card-text>
            <v-row>
                <v-col cols="1">
                </v-col>
                <v-col cols="4">
                    {{ $t('date') }}
                </v-col>
                <v-col cols="4">
                    {{ $t('orderStatus') }}
                </v-col>
                <v-col cols="3">
                    {{ $t('total') }}
                </v-col>
            </v-row>

            <v-row v-for="item in orders" :key="item.orderId" @click="onClick(item)">
                <v-col cols="1">
                    <v-icon>mdi-open-in-app</v-icon>
                </v-col>
                <v-col cols="4">
                    {{ displayDate(item) }}
                </v-col>
                <v-col cols="4">
                    <OrderStatus :order="item"></OrderStatus>
                </v-col>
                <v-col cols="3">
                    {{ item.orderTotalToDisplay }}
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions class="mb-6">
            <v-btn variant="text" prepend-icon="mdi-chevron-right" :disabled="isLastPage || loading" @click="next()"> {{
                $t('next')
            }}
            </v-btn>
            <v-spacer></v-spacer>
            {{ $t('page') }}#&nbsp;{{ page }} {{ $t('of') }} &nbsp;{{ totalPages }}
            <v-spacer></v-spacer>
            <v-btn variant="text" append-icon="mdi-chevron-left" :disabled="page == 1 || loading" @click="previous()">
                {{ $t('previous') }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { getOrders } from "@/services/order";
import moment from "moment";

const pageSize = 10;
const filter = ["pending", "submitted", "processing"];

export default {
    async created() {
        await this.fetchOrders(pageSize, this.skip)
    },
    methods: {
        displayDate(item) {
            const d = new Date(item.date);
            return moment(d).format("DD/MM/YY");
        },
        async fetchOrders(pageSize, skip) {
            this.loading = true;
            const res = await getOrders({ pageSize, skip }, filter);
            this.orders = res.orders.map(o => {
                return {
                    ...o,
                    date: (new Date(o.utcTimestamp)).toLocaleDateString(),
                    orderTotalToDisplay: `${o.orderTotal} ${this.$t('currencySymbol')}`
                }
            });
            this.isLastPage = res.pageSize + res.skip >= res.total;
            this.totalPages = Math.ceil(res.total / res.pageSize);
            this.loading = false;
        },
        async next() {
            if (this.isLastPage) {
                return;
            }
            await this.fetchOrders(pageSize, this.skip += pageSize);
            this.page += 1;
        },
        async previous() {
            if (this.page == 1) {
                return;
            }

            await this.fetchOrders(pageSize, this.skip -= pageSize);
            this.page -= 1;
        },
        onClick(item) {
            const r = `${useAppConfig().routes.accountOrders}/${item.orderId}`;
            navigateTo(r);
        }
    },
    data() {
        return {
            loading: false,
            isLastPage: false,
            totalPages: 0,
            orders: [],
            skip: 0,
            page: 1
        };
    }
}
</script>