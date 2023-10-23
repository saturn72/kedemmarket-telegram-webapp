<template>
    Not exists
</template>
    
<script>
export default {
    props: {
        order: { type: Object }
    },
    methods: {
        repurchaseOrder() {
            const userCart = useCartStore();
            this.order.items.forEach(item => {
                if (!item.reordered) {
                    userCart.incrementCartItem(item.product, item.orderedQuantity);
                    item.reordered = true;
                }
            });
        },
        repurchaseItem(item) {
            const userCart = useCartStore();
            userCart.incrementCartItem(item.product, item.orderedQuantity);
            item.reordered = true;
        }
    },
    computed: {
        reordered() {
            return this.order?.items?.every(x => x.reordered);
        }
    }
}
</script>