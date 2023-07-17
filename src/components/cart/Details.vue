<template>
    <v-container>
        <v-card tile>
            <v-card-title>{{ $t(carts.length > 1 ? 'carts' : 'cart') }}</v-card-title>
            <v-card v-for="cart in carts" :key="cart.id" tile class="p4-4">
                <v-card-title>
                    <v-avatar size="55" :lazy-src="useAppConfig().defaults.thumbnail"
                        :image="cart.vendor?.image"></v-avatar>
                    {{ cart.vendor.name }}
                </v-card-title>
                <v-divider></v-divider>

                <CartProductDetails :cart="cart"> </CartProductDetails>
            </v-card>
        </v-card>
    </v-container>
</template>
<script setup>
import { useCartStore } from '@/stores/cart'
import { computed } from 'vue'

const carts = computed(() => useCartStore().vendorCarts?.filter(c => c.items?.length > 0)) ?? [];
</script>