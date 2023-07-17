<template>
    <v-footer padless app>
        <v-bottom-navigation class="pt-1" grow fixed color="teal">
            <v-btn plain @click="$router.push('/cart')">
                <v-badge :content="cartItemCount" :model-value="cartItemCount > 0" color="green" floating>
                    <v-icon>mdi-cart-outline</v-icon>
                    <h2 v-if="cartTotal > 0">
                        {{ $t('currencySymbol') }}{{ cartTotal }}
                    </h2>
                </v-badge>
            </v-btn>
            <v-btn plain @click="$router.push('/account')">
                <v-avatar v-if="$user.photoURL" size="55" :lazy-src="useAppConfig().defaults.thumbnail"
                    :image="$user.photoURL"></v-avatar>
                <v-icon v-else>mdi-account-outline</v-icon>
            </v-btn>
            <v-btn plain @click="onStoreClicked()">
                <v-icon>mdi-store-outline</v-icon>
            </v-btn>
        </v-bottom-navigation>
    </v-footer>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
import { useVendorStore } from '@/stores/vendor';
import { computed } from 'vue'

const cartItemCount = computed(() => useCartStore().cartItemCount);
const cartTotal = computed(() => useCartStore().vendorCartTotal);
</script>
<script>
export default {
    methods: {
        onStoreClicked() {
            const route = useVendorStore().route ?? useAppConfig().defaults.storeRoute;
            this.$router.push(route);
        }
    },
    data() {
        return {
            items: [{
                icon: 'mdi-cart',
                isCart: true,
                path: '/cart',
                title: 'Cart',
            }, {
                icon: 'mdi-account-outline',
                path: '/account',
                title: 'Account',
            },
            ]
        }
    }
}
</script>