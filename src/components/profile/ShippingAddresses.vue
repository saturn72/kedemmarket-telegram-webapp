
<template>
    <v-card flat>
        <v-card-actions>
            <v-row>
                <v-col>
                    <v-btn variant="flat" block :disabled="profile.shipping.useBillingAddress || loading" :loading="loading"
                        color="info" @click="useBillingAddress()">
                        <v-icon>mdi-map-marker-account-outline</v-icon>&nbsp;{{ $t('useBillingAddress') }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-actions>
        <v-data-iterator :items="profile.shipping.addresses" :key="alias" :items-per-page="itemsPerPage" :sort-by="sortBy()"
            cols="12" sm="6" md="6">
            <template v-slot:default="{ items }">
                <v-card flat>
                    <v-row>
                        <v-col v-for="(item, i) in items" :key="i.alias" :value="i.alias">
                            <v-card>
                                <v-card-text>
                                    <ProfileShippingAddressCard :address="item.raw"></ProfileShippingAddressCard>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card>
            </template>
        </v-data-iterator>

        <v-card-actions v-if="profile.shipping.addresses.length < itemsPerPage">
            <ProfileShippingAddressNewForm :profile="profile" @address-saved="addressSaved">
            </ProfileShippingAddressNewForm>
        </v-card-actions>
    </v-card>
</template>

<script>
import { saveUserProfile } from "@/services/profile";
import _ from 'lodash';

export default {
    props: {
        profile: { type: Object, default: undefined },
        mode: { type: String, default: undefined },
    },
    created() {
        if (!this.profile.shipping) {
            this.profile.shipping = { useBillingAddress: false };
            this.profile.shipping.addresses = [];
        }
    },
    mounted() {
        if (this.mode == "edit") {
            this.toggleUpdate();
        }
    },
    methods: {
        sortBy() {
            return [
                { key: "isDefault", order: 'desc' },
                // { key: "alias", order: 'desc' }
            ];
        },
        async useBillingAddress() {
            this.loading = true;
            this.profile.shipping.useBillingAddress = true;
            await saveUserProfile(this.profile);
            this.loading = false;
            this.$emit("saved");
        },
        async addressSaved(address) {
        },
    },
    data: () => {
        return {
            valid: false,
            loading: false,
            itemsPerPage: 3
        }
    }
}
</script>