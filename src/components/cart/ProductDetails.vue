<template>
    <v-card flat>
        <v-row>
            <v-col cols="3" justify-center class="text-subtitle-2 my-5">
                <v-badge overlap :content="cartItem.orderedQuantity ?? 0" color="success">
                    <v-avatar size="large" :image="cartItem.product.image.url"
                        :lazy-src="useAppConfig().defaults.thumbnail"></v-avatar>
                </v-badge>
            </v-col>
            <v-col cols="5" class="text-subtitle-2 px-0 mx-0">
                {{ cartItem.product.name }}
            </v-col>
            <v-col cols="4">
                <v-card-actions>
                    <v-icon @click="$emit('removeFromCart')">mdi-delete-outline</v-icon>
                    <v-spacer></v-spacer>
                    <v-icon @click="$emit('increment')">mdi-plus</v-icon>
                    <v-spacer></v-spacer>
                    <v-icon @click="$emit('decrement')">mdi-minus</v-icon>
                </v-card-actions>
            </v-col>
        </v-row>
    </v-card>
</template>

<script >

export default {
    props: {
        cartItem: { type: Object }
    },
}
</script>