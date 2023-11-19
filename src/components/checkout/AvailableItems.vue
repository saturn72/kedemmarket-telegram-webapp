<template>
    <v-card v-for="item in checkoutCartStore.items" @removeFromCart="removeFromCart(item)" flat>
        <v-row>
            <v-col cols="2" justify-center class="text-subtitle-2 my-4 mr-2">
                <v-badge overlap :content="item.orderedQuantity ?? 0" color="success">
                    <v-avatar :image="item.product.image.url" :lazy-src="useAppConfig().defaults.thumbnail"></v-avatar>
                </v-badge>
            </v-col>
            <v-col cols="4" class="text-subtitle-2 d-flex flex-column justify-center">
                {{ item.product.name }}
            </v-col>
            <v-col cols="2" class="text-subtitle-2 d-flex flex-column justify-center">
                <v-progress-circular v-if="item.loading" size="15" width="1" indeterminate></v-progress-circular>
                <strong v-else>{{ item.priceAfterDiscounts }}</strong>
            </v-col>
            <v-col cols="3" class="d-flex justify-center">
                <v-card-actions>
                    <v-row>
                        <v-col>
                            <v-icon @click="decrementCartItem(item)">mdi-minus</v-icon>
                        </v-col>
                        <v-col>
                            <v-icon @click="incrementCartItem(item)">mdi-plus</v-icon>
                        </v-col>
                    </v-row>
                </v-card-actions>
            </v-col>
        </v-row>
    </v-card>
</template>


@removeFromCart="removeFromCart(item)" @increment=""
@decrement=""

<script>
import { useCheckoutCartStore } from "@/stores/checkoutCart";
import { useCartStore } from "@/stores/cart";

export default {
    setup() {
        const checkoutCartStore = computed(() => useCheckoutCartStore());

        const loading = computed(() => {
            const items = useCheckoutCartStore().items;
            return items && items.some(i => i.loading);
        });

        const error = computed(() => useCheckoutCartStore().error || false);
        const calculating = computed(() => useCheckoutCartStore().calculating || false);
        useCheckoutCartStore().calculate(0);


        return {
            checkoutCartStore,
            loading,
            calculating,
            error
        };
    },
    data() {
        return {
            itemToDelete: null,
            orderDialog: false,
        }
    },
    methods: {
        incrementCartItem(item) {
            useCartStore().incrementCartItem(item.product);
            this.updateCheckoutCart(item);
        },
        decrementCartItem(item) {
            if (item.orderedQuantity == 1) {
                this.$emit('removeFromCart', item);
            }
            else {
                useCartStore().decrementCartItem(item.product);
                this.updateCheckoutCart(item);
            }
        },
        updateCheckoutCart(item) {
            item.orderedQuantity = useCartStore().getProductQuantity(item.product.id)
            item.loading = true;
            useCheckoutCartStore().calculate(2000);
        }
    },
}
</script>
