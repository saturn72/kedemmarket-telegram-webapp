
<template>
    <v-card flat>
        <v-card-actions>
            <v-row>
                <v-col>
                    <v-btn variant="outlined" block :disabled="profile.shipping.useBillingAddress || loading"
                        :loading="loading" color="info" @click="useBillingAddress()">
                        <v-icon>mdi-map-marker-account-outline</v-icon>&nbsp;{{ $t('useBillingAddress') }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-actions>
        <v-card-text>
            <v-data-iterator :items="displayAddresses" items-per-page="5">
                <template v-slot:default="{ items }">
                    <v-card flat>
                        <v-row>
                            <v-col v-for="(item, i) in items" :key="i" height="50">
                                <v-card>
                                    <v-card-text v-if="i == 0">
                                        <ProfileShippingAddressNewForm :profile="profile"></ProfileShippingAddressNewForm>
                                    </v-card-text>
                                    <v-card-text v-else>
                                        <ProfileShippingAddressCard :address="item"></ProfileShippingAddressCard>
                                    </v-card-text>

                                </v-card>

                            </v-col>
                        </v-row>
                    </v-card>
                </template>
            </v-data-iterator>
        </v-card-text>
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
        this.profile.shipping.addresses
    },
    mounted() {
        if (this.mode == "edit") {
            this.toggleUpdate();
        }
        this.displayAddresses.push(...this.profile.shipping.addresses)
    },
    methods: {
        async useBillingAddress() {
            this.loading = true;
            this.profile.shipping.useBillingAddress = true;
            await saveUserProfile(this.profile);
            this.loading = false;
            this.$emit("saved");
        },
    },
    data: () => {
        return {
            valid: false,
            loading: false,
            displayAddresses: [{}]
        }
    }
}
</script>