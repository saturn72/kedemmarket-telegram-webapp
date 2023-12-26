<template>
    <v-card height="100%" flat class="d-flex flex-column justify-center" max-width>
        <v-card-title class="ma-4">
            <v-row>
                {{ $t('orderTotal') }}&nbsp;{{ $t('currencySymbol') }}{{ order.orderTotal }}
                <v-spacer></v-spacer>
                <OrderStatus :order="order"></OrderStatus>
            </v-row>
        </v-card-title>
        <v-card-subtitle>
            <v-row>
                <v-col>
                    {{ $t('date') }} {{ displayDate() }}
                </v-col>
                <v-col>
                    {{ $t('orderNumber') }} {{ order.orderId }}
                </v-col>
            </v-row>
        </v-card-subtitle>
        <v-divider thickness="5"></v-divider>

        <v-card-text>
            <v-card-subtitle>{{ $t('orderItems') }}</v-card-subtitle>
            <v-divider thickness="2"></v-divider>

            <OrderProductDetails v-for="item in order.items" :item="item" @repurchaseItem="repurchaseItem">
            </OrderProductDetails>
        </v-card-text>

        <v-card-actions>
            <v-btn block variant="flat" color="secondary" @click="repurchaseOrder()" :disabled="reordered">{{
                $t('repurchaseOrder')
            }}
                &nbsp;<v-icon>mdi-autorenew</v-icon>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
    
<script>
import { useCartStore } from '@/stores/cart';
import moment from "moment";

export default {
    props: {
        order: { type: Object }
    },
    methods: {
        displayDate() {
            return moment(this.order.createdOnUtc._seconds * 1000).format('L LT');
        },
        repurchaseOrder() {
            const userCart = useCartStore();
            this.order.items.forEach(item => {
                if (!item.reordered) {
                    userCart.incrementCartItem(item.product, item.orderedQuantity);
                    item.reordered = true;
                }
            });
        },
        repurchaseItem(item) {
            const userCart = useCartStore();
            userCart.incrementCartItem(item.product, item.orderedQuantity);
            item.reordered = true;
        }
    },
    computed: {
        reordered() {
            return this.order?.items?.every(x => x.reordered);
        }
    }
}
</script>