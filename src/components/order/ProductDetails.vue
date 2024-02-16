<template>
    <v-card flat class="mb-6 mr-n4" max-width>
        <v-row>
            <v-col cols="3" justify-center class="text-subtitle-2 mt-4">
                <ProductBadgedAvatar :product="item"></ProductBadgedAvatar>
            </v-col>
            <v-col cols="4" class="text-subtitle-2 d-flex flex-column justify-center">
                {{ item.product.name }}
            </v-col>
            <v-col cols="3" class="text-subtitle-2 d-flex flex-column justify-center">
                <strong>{{ item.priceAfterDiscounts }} {{ $t('currencySymbol') }}</strong>
            </v-col>
            <v-col cols="2" class="d-flex align-center">
                <v-btn icon :variant="item.reordered ? 'outlined' : 'flat'" color="secondary" size="x-small"
                    @click="$emit('repurchaseItem', item)" :disabled="item.reordered">
                    <v-icon>mdi-autorenew</v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </v-card>
    <v-divider></v-divider>
</template>

<script >
export default {
    props: {
        item: { type: Object }
    }
}
</script>