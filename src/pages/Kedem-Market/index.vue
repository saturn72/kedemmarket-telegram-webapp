<template>
    <v-container v-if="!vendors">
        <v-row>
            <v-col class="d-flex justify-center">
                <v-progress-circular indeterminate :size="75" :width="5"></v-progress-circular>
            </v-col>
        </v-row>
    </v-container>
    <v-container v-else>
        <v-card flat>
            <v-card-text>
                <v-row justify="center">
                    <v-col cols="6" v-for="vendor in vendors" :key="vendor.id">
                        <v-card flat>
                            <v-card-title class="d-flex justify-center">
                                {{ vendor.name }}
                                <!-- <ProductBadgedAvatar :product="product"></ProductBadgedAvatar> -->
                            </v-card-title>
                            <!-- <v-card-text>{{ vendor.name }}<strong>&centerdot; {{ product.price }}</strong></v-card-text> -->
                            <v-card-actions>
                                <!-- <ProductButtons :product="product"></ProductButtons> -->
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>
  
<script>
import { useStoreStore } from '@/stores/store'
import { computed } from 'vue'

export default {
    setup() {
        const store = useStoreStore();
        store.setStore();

        return {
            vendors: computed(() => store.getVendors)
        }
    },
    data() {
        return {
            loading: true,
        }

    }
}

</script>