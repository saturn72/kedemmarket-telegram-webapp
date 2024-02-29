<template>
    <v-footer padless app>
        <v-bottom-navigation class="pt-1" grow fixed color="teal" height="70">
            <v-btn plain @click="toRoute(checkout)">
                <v-badge :content="cartItemCount" :model-value="cartItemCount > 0" color="green" floating
                    location="top start">
                    <v-icon>mdi-cart-outline</v-icon>
                    <v-slide-x-transition>
                        <h2 v-if="cartTotal > 0 && !isCheckout">
                            {{ $t('currencySymbol') }}{{ cartTotal }}
                        </h2>
                    </v-slide-x-transition>
                </v-badge>
                {{ $t('toCart') }}
            </v-btn>

            <v-btn plain @click="toRoute(account)">
                <v-avatar v-if="userImage" size="small">
                    <v-img :src="userImage">
                        <template v-slot:placeholder>
                            <div class="d-flex align-center justify-center fill-height">
                                <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                            </div>
                        </template>
                    </v-img>
                </v-avatar>

                <v-icon v-else>mdi-account-outline</v-icon>
                {{ $t('toAccount') }}
            </v-btn>

            <v-btn plain @click="toRoute(home)">
                <v-icon>mdi-store-outline</v-icon>
                {{ $t('toStore') }}
            </v-btn>
        </v-bottom-navigation>
    </v-footer>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
import { computed } from 'vue'

const cartItemCount = computed(() => useCartStore().getTotalCartItemsCount);
const cartTotal = computed(() => useCartStore().getCartTotal);
const isCheckout = computed(() => useRoute().path.startsWith(useAppConfig().routes.checkout));

const userImage = computed(() => {
    const img = useUserStore().getUser?.photoURL;
    if (!img || img == null) {
        return undefined;
    }
    return img.trim();
});

const { account, checkout, home } = useAppConfig().routes;
</script>

<script>
export default {
    methods: {
        toRoute(route) {
            useRouter().push(route)
        }
    }
}
</script>