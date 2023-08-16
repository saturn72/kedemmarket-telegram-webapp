<template>
    <v-card flat class="mb-6">
        <v-row>
            <v-col cols="2" justify-center class="text-subtitle-2 mt-4">
                <v-badge overlap :content="item.orderedQuantity ?? 0" color="success">
                    <v-avatar :image="item.product.image.url" :lazy-src="useAppConfig().defaults.thumbnail"></v-avatar>
                </v-badge>
            </v-col>
            <v-col cols="5" class="text-subtitle-2 d-flex flex-column justify-center">
                {{ item.product.name }}
            </v-col>
            <v-col cols="3" class="text-subtitle-2 d-flex flex-column justify-center">
                <v-progress-circular v-if="item.loading" size="15" width="1" indeterminate></v-progress-circular>
                <strong v-else>{{ item.priceAfterDiscounts }} {{ $t('currencySymbol') }}</strong>
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