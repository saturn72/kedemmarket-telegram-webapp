<template>
    <div v-for="item in tierPrices">
        {{ item.quantity }}<strong>&centerdot; {{ $t('for') }} {{ item.price }} {{ $t('currencySymbol')
        }}</strong>&nbsp;{{ $t('perUnit') }}
    </div>
</template>
<script>
export default {
    props: {
        product: { type: Object }
    },
    computed: {
        tierPrices() {
            const tp = this.product.tierPrices;

            return tp && tp.length > 0 ?
                tp :
                [{ quantity: 1, price: this.product.price }]
        }
    }
}
</script>
 