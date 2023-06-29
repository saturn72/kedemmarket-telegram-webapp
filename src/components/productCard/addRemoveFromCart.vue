<template>
    <v-row justify="center">
        <v-col cols="2">
            <v-btn icon :disabled=" qty==0" @click="$emit('decrement', product)">
                <v-icon>
                    mdi-minus-circle-outline
                </v-icon>
            </v-btn>
        </v-col>
        <!-- <v-col cols="3">
            <v-text-field v-bind:key="product.id" dense :label="$t('quantity')" readonly v-bind:value="qty"
                width="40px">
            </v-text-field>

        </v-col> -->
        <v-col>
            <v-btn color="info" block @click="$emit('increment', product)">
                <v-icon>
                    mdi-plus-circle-outline
                </v-icon>
            </v-btn>
        </v-col>
    </v-row>
</template>

<script>
export default {
    props:
    {
        product: { type: Object },
        qty: { type: Number, default: 0 }
    },
}
</script>
