<template>
  <v-container v-if="!vendor">
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
          <v-col cols="6" v-for="product in vendor.products" :key="product.id">
            <v-card flat>
              <v-card-title class="d-flex justify-center">
                <ProductBadgedAvatar :product="product"></ProductBadgedAvatar>
              </v-card-title>
              <v-card-text>{{ product.name }}<strong>&centerdot; {{ product.price }}</strong></v-card-text>
              <v-card-actions>
                <ProductButtons :product="product"></ProductButtons>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { useVendorStore } from '@/stores/vendor'
import { computed } from 'vue'

export default {
  setup() {
    const store = useVendorStore();
    store.setVendor();

    return {
      vendor: computed(() => store.vendor)
    };
  }
}
</script>