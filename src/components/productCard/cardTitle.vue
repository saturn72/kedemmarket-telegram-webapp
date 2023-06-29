<template>
    <v-row>
        <v-col cols="4" class="ma-2" dense>
            <v-badge left overlap :value="cartQty > 0" color="green" bordered>
                <template slot="badge">
                    <v-icon>mdi-cart</v-icon> &nbsp;{{ cartQty }}
                </template>
                <v-avatar rounded color="grey" size="100">
                    <v-img :src="src" :alt="product.name"></v-img>
                </v-avatar>
            </v-badge>
        </v-col>
        <v-col>
            <v-row>
                <v-card-title>
                    {{ product.name }}
                </v-card-title>
            </v-row>
            <v-row no-gutters>
                <Price :product="product"></Price>
            </v-row>
        </v-col>
    </v-row>
</template>
<style>
.v-badge__badge {
    font-size: 14px;
}
</style>
<script>

// import mediaCache from "~/mediaCache";
// import { toServerUrl } from "~/mediaUtils";
// import { vxm } from '~/store';
import Price from '~/components/ProductCard/price.vue';

export default {
    props:
    {
        product: { type: Object },
    },
    components: {
        Price
    },
    async created() {
        // vxm.cart.$subscribe("incrementCartItem", payload => {
        //     this.countCartQuantity();
        // });

        // vxm.cart.$subscribe("decrementCartItem", payload => {
        //     this.countCartQuantity();
        // });

        // if (this.product.media?.pictures.length > 0) {
        //     this.product.pictureUrl = toServerUrl(this.product.media.pictures[0].url);

        //     this.src = await mediaCache.get({
        //         key: this.product.pictureUrl,
        //         url: this.product.pictureUrl
        //     });
        // }
        // this.countCartQuantity();
    },
    computed: {
        price() {
            return `${this.product.price} ${this.$t('currencySymbol')}`
        }
    },
    methods: {
        onClick() {
            //vxm.overlay.setOverlay({ component: "catalog-product-profile-card" })
        },
        async countCartQuantity() {
            //  this.cartQty = await vxm.cart.getProductQuantity(this.product.id);
        }
    },
    data() {
        return {
            cartQty: 0,
            placeholder: "/logo-grayscale.jpg",
            src: "/logo.jpg",
        }
    }
}
</script>
