<template>
    <v-card class="mx-1" outlined>
        <card-title :product="product"></card-title>
        <v-card-text>
            <AddRemoveFromCart :product="product" :qty.sync="qty" @increment="incrementVendorCartItem"
                @decrement="decrementVendorCartItem">
            </AddRemoveFromCart>
        </v-card-text>
    </v-card>
</template>

<script>
import CardTitle from './cardTitle.vue';
import Price from './price.vue';
import AddRemoveFromCart from './addRemoveFromCart.vue';
// import { vxm } from '~/store';

export default {
    props: {
        product: { type: Object }
    },
    components: {
        CardTitle,
        Price,
        AddRemoveFromCart,
    },
    async created() {
        // this.qty = await vxm.cart.getProductQuantity(this.product.id);
    },
    methods: {
        async decrementVendorCartItem(product) {
            // vxm.cart.decrementVendorCartItem(product);
            // this.qty = await vxm.cart.getProductQuantity(product.id);
        },
        async incrementVendorCartItem(product) {
            // vxm.cart.incrementVendorCartItem(product);
            // this.qty = await vxm.cart.getProductQuantity(product.id);
        },
    },
    data() {
        return { qty: 1 }
    }
}
</script>