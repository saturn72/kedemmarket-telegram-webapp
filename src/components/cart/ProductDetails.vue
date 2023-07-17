<template>
    <v-dialog v-click-outside="onCancelDeleteFromCart" v-model="itemToDelete" width="auto" class="text-center"> <v-card>
            <v-card-text>{{ dialogText }}</v-card-text>
            <v-card-actions>
                <v-btn color="warning" @click="onDeleteFromCart">{{ $t('confirm') }}</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="onCancelDeleteFromCart">{{ $t('cancel') }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-card flat v-for="item in    cart.items   ">
        <v-row>
            <v-col cols="3" justify-center class="text-subtitle-2 my-5">
                <v-badge overlap :content="item.orderedQuantity ?? 0" color="success">
                    <v-avatar size="large" :image="item.product.image?.url"
                        :lazy-src="useAppConfig().defaults.thumbnail"></v-avatar>
                </v-badge>
            </v-col>
            <v-col cols="5" class="text-subtitle-2 px-0 mx-0">
                {{ item.product.name }}
            </v-col>
            <v-col cols=" 4">
                <v-card-actions>
                    <v-icon @click="deleteFromCart(item)">mdi-delete-outline</v-icon>
                    <v-spacer></v-spacer>
                    <v-icon @click="onIncrementVendorCartItem(item)">mdi-plus</v-icon>
                    <v-spacer></v-spacer>
                    <v-icon @click="onDecrementVendorCartItem(item)">mdi-minus</v-icon>
                </v-card-actions>
            </v-col>
        </v-row>
    </v-card>
</template>
<script >
import { useCartStore } from '@/stores/cart';


export default {
    props: {
        cart: { type: Object }
    },
    data() {
        return {
            itemToDelete: null,
        }
    },
    methods: {
        deleteFromCart(item) {
            this.itemToDelete = item;
            const t = this.$t('deleteFromCart');
            this.dialogText = t.replace("##0##", this.itemToDelete.product.name)
            this.dialog = true;
        },
        onDeleteFromCart() {
            useCartStore().removeItemFromCart(this.cart, this.itemToDelete.product);
            this.itemToDelete = undefined;
        },
        onCancelDeleteFromCart() {
            this.itemToDelete = undefined;
        },
        onIncrementVendorCartItem(item) {
            useCartStore().incrementCartItem(this.cart, item.product);
        },
        onDecrementVendorCartItem(item) {
            useCartStore().decrementCartItem(this.cart, item.product);
        }
    }
}
</script>