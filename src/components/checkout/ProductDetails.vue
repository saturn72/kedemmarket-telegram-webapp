<template>
    <v-card flat>
        <v-row>
            <v-col cols="2" justify-center class="text-subtitle-2 my-4 mr-2">
                <v-badge overlap :content="cartItem.orderedQuantity ?? 0" color="success">
                    <v-avatar :image="cartItem.product.image.url" :lazy-src="useAppConfig().defaults.thumbnail"></v-avatar>
                </v-badge>
            </v-col>
            <v-col cols="4" class="text-subtitle-2 d-flex flex-column justify-center">
                {{ cartItem.product.name }}
            </v-col>
            <v-col cols="2" class="text-subtitle-2 d-flex flex-column justify-center">
                <v-progress-circular v-if="cartItem.loading" size="15" width="1" indeterminate></v-progress-circular>
                <strong v-else>{{ cartItem.priceAfterDiscounts }}</strong>
            </v-col>
            <v-col cols="3" class="d-flex flex-column justify-center">
                <v-card-actions>
                    <v-icon @click="$emit('removeFromCart')">mdi-delete-outline</v-icon>
                    <v-spacer></v-spacer>
                    <v-icon @click="$emit('decrement')">mdi-minus</v-icon>
                    <v-spacer></v-spacer>
                    <v-icon @click="$emit('increment')">mdi-plus</v-icon>
                </v-card-actions>
            </v-col>
        </v-row>
    </v-card>
</template>

<script >

export default {
    props: {
        cartItem: { type: Object }
    }
}
</script>