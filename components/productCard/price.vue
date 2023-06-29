<template>
    <p>{{ product.priceText }}</p>
</template>
<script>
export default {
    props:
    {
        product: { type: Object },
    },
    created() {
        this.product.priceText = `${this.product.price} ${this.$t('currencySymbol')}`;

        if (this.product.unitType) {
            this.product.priceText = `${this.product.price} ${this.$t('currencySymbol')} ל ${this.product.unitType}`;
        }
    }
}
</script>
