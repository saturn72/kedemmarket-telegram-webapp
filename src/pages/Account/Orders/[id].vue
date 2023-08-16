<template>
    <v-card height="100%" flat class="d-flex flex-column justify-center">
        <v-card-title>
            {{ $t('orderTotal') }}&nbsp;{{ $t('currencySymbol') }}{{ order.orderTotal }}
        </v-card-title>
        <v-card-subtitle>
            {{ $t('orderNumber') }} {{ order.orderId }}
        </v-card-subtitle>

        <v-card-text>
            <v-card-subtitle>{{ $t('orderItems') }}</v-card-subtitle>
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
import { getOrderById } from '@/services/order';
import { useCartStore } from '@/stores/cart';



export default {
    async created() {
        const id = this.$route.params.id;
        this.order = await getOrderById(id);
    },
    methods: {
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
            return this.order.items.every(x => x.reordered);
        }
    },
    data() {
        return {
            order: {}
        }
    }
}
</script>