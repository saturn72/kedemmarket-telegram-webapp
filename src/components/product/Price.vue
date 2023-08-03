<template>
    <div v-if="product.tierPrices" v-for="item in product.tierPrices">
        {{ item.quantity }}<strong>&centerdot; {{ $t('for') }} {{ item.price }} {{ $t('currencySymbol')
        }}</strong>&nbsp;{{ $t('perUnit') }}
    </div>
    <div v-else>
        {{ product.name }}<strong>&centerdot; {{ product.price }} {{ $t('currencySymbol') }}</strong>
    </div>
</template>
<script>
export default {
    props: {
        product: { type: Object }
    }
}
</script>
