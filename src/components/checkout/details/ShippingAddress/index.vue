<template>
    <v-card flat>

        <v-card-title>
            <v-row no-gutters>
                <v-col>
                    <v-text-field v-if="useBillingAddress" readonly density="compact" variant="plain"
                        prepend-icon="mdi-eye-outline">{{
                            $t('usingBillingAddress')
                        }}</v-text-field>
                    <v-btn v-else block variant="flat" :disabled="profile.shipping.useBillingAddress || loading"
                        :loading="loading" color="primary" @click="setBillingAddress">
                        <v-icon>mdi-map-marker-account-outline</v-icon>&nbsp;{{ $t('useBillingAddress') }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-title> <v-card-text>

            <v-data-iterator :items="profile.shipping.addresses" :key="alias" :items-per-page="maxAllowedAddresses"
                :sort-by="sortBy()" cols="12" sm="12" md="6">
                <template v-slot:default="{ items }">
                    <CheckoutDetailsShippingAddressCard v-for="(item, i) in items" :key="i.alias" :value="i.alias"
                        :address="item.raw" @click="$emit('shipping-address-selected', item.raw)">
                    </CheckoutDetailsShippingAddressCard>
                </template>
            </v-data-iterator>
        </v-card-text>
    </v-card>
</template>

<script>
import _ from "lodash";

export default {
    props: {
        profile: { type: Object, default: undefined },
        loading: { type: Boolean, default: false }
    },
    updated() {
        this.useBillingAddress = this.profile.shipping.useBillingAddress;
    },
    methods: {
        setBillingAddress() {
            const c = _.cloneDeep(this.profile.billingInfo);
            const a = _.omit(c, ['valid']);
            this.$emit('shipping-address-selected', a);
        },
        sortBy() {
            return [
                { key: "isDefault", order: 'desc' },
            ];
        }
    },
    data: () => {
        return {
            useBillingAddress: false,
            //     valid: undefined,
            //     srcBillingInfo: undefined,
            //     billingInfo: undefined,
        }
    }
}
</script>
