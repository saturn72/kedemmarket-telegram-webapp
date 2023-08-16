<template>
    <v-card loading height="100%" flat class="d-flex flex-column align-center justify-center">
        <template v-slot:loader>
            <v-progress-linear color="success" v-model="bufferValue"></v-progress-linear>
        </template>
        <v-card-title>
            {{ $t('orderPlaced') }}
        </v-card-title>
        <v-card-subtitle>
            {{ $t('thankYouMessage') }}
        </v-card-subtitle>
        <v-card-text>
            {{ $t('youAreRedirectedToTheStore') }}
        </v-card-text>

        <v-card-actions>
            <v-btn v-if="order" variant="outlined" color="#128C7E" prepend-icon="mdi-whatsapp" @click="sendToWhatsapp">
                {{ $t('sendToWhatsapp') }}
                <template v-slot:prepend>
                    <v-icon color="#128C7E"></v-icon>
                </template>
            </v-btn>
            <v-spacer></v-spacer>
            <AppBackToStoreButton />
        </v-card-actions>
    </v-card>
</template>

<script>

let intervalTimer = undefined;
let timoutTimer = undefined;

export default {
    setup() {
        onBeforeUnmount(() => {
            if (intervalTimer) {
                clearInterval(intervalTimer);
            }

            if (timoutTimer) {
                clearTimeout(timoutTimer);
            }
        });
    },
    created() {
        const query = useRoute().query;
        if (query.order) {
            this.order = JSON.parse(query.order);
        }

        const interval = 100;
        const totalDelay = 10000;
        const bufferStep = (interval / totalDelay) * 100;

        intervalTimer = setInterval(() => {
            this.bufferValue += bufferStep;
        }, interval);
        timoutTimer = setTimeout(() => navigateTo(useAppConfig().routes.home), totalDelay);
    },
    data() {
        return {
            order: undefined,
            bufferValue: 0
        }
    },
    methods: {
        sendToWhatsapp() {
            const o = this.order;
            let text = `${this.$t('kedemmarket')}\n${this.$t('orderNumber')}\t*${o.orderId}*\n\n`;

            let i = 1;
            o.items.forEach(x => {
                text += `${i++}.\t${x.product.name}\t${x.orderedQuantity} ${this.$t('units')}\t${this.$t('itemTotal')} ${x.priceAfterDiscounts}\n`
            });
            const { store, account, orders } = useAppConfig().routes;
            text += `\n\n*${this.$t('orderLink')}:* ${store}${account}${orders}/${o.orderId}`

            const te = encodeURIComponent(text);
            const link = `https://wa.me/${useAppConfig().defaults.whatsappPhone}?text=${te}`

            navigateTo(link, {
                external: true,
                open: {
                    target: '_blank',
                }
            })
            useRouter().push(useAppConfig().routes.home)
        }
    }
}
</script>
