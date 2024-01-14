<template>
    <div v-for="item in prices">
        {{ item.quantity }}<strong>&centerdot; {{ $t('for') }} {{ item.price }} {{ $t('currencySymbol')
        }}</strong>&nbsp;{{ $t('perUnit') }}
    </div>
</template>
<script>
import _ from "lodash";

export default {
    props: {
        product: { type: Object }
    },
    computed: {
        prices() {
            let prices = [{ quantity: 1, price: this.product.price }];
            const tp = this.product.tierPrices;

            if (tp && tp.length > 0) {
                prices = _.sortedUniqBy(prices.concat(tp), o => o.quantity);
            }
            return prices;
        }
    }
}
</script>
 