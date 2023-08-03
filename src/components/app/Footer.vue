<template>
    <v-footer padless app>
        <v-bottom-navigation class="pt-1" grow fixed color="teal" height="70">
            <v-btn plain @click="$router.push('/cart')">
                <v-badge :content="cartItemCount" :model-value="cartItemCount > 0" color="green" floating
                    location="top start">
                    <v-icon>mdi-cart-outline</v-icon>
                    <h2 v-if="cartTotal > 0">
                        {{ $t('currencySymbol') }}{{ cartTotal }}
                    </h2>
                </v-badge>
                {{ $t('toCart') }}
            </v-btn>
            <v-btn plain @click="$router.push('/account')">
                <v-icon>mdi-account-outline</v-icon>
                {{ $t('toAccount') }}
            </v-btn>
            <v-btn plain @click="$router.push('/')">
                <v-icon>mdi-store-outline</v-icon>
                {{ $t('toStore') }}
            </v-btn>
        </v-bottom-navigation>
    </v-footer>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'

const cartItemCount = computed(() => useCartStore().getCartItemCount);
const cartTotal = computed(() => useCartStore().getCartTotal);
const user = useUserStore().user;
</script>
<script>
export default {
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