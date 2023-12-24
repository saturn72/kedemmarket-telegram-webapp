
<template>
    <v-dialog :model-value="dialog">
        <ProfileShippingAddressAddOrEditForm :profile="profile" :address="editedAddress" @on-cancel="toggleDialog"
            @address-saved="addressSaved">
        </ProfileShippingAddressAddOrEditForm>
    </v-dialog>
    <v-card>
        <v-card-title>
            <v-row no-gutters>
                <v-col>
                    <v-text-field v-if="profile.shipping.useBillingAddress" readonly density="compact" variant="plain"
                        prepend-icon="mdi-eye-outline" @click:prepend="toBillingInfo">{{
                            $t('usingBillingAddress')
                        }}</v-text-field>
                    <v-btn v-else block variant="flat" :disabled="profile.shipping.useBillingAddress || loading"
                        :loading="loading" color="info" @click="useBillingAddress()">
                        <v-icon>mdi-map-marker-account-outline</v-icon>&nbsp;{{ $t('useBillingAddress') }}
                    </v-btn>
                </v-col>
            </v-row>
            <v-row no-gutters v-if="showAddButton">
                <v-col>
                    <v-btn block variant="outlined" color="info" @click="toggleDialog()">
                        <v-icon size="x-large">mdi-plus-circle-outline</v-icon>&nbsp;{{ $t("addressAdd") }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-title>
        <v-data-iterator :items="profile.shipping.addresses" :key="alias" :items-per-page="maxAllowedAddresses"
            :sort-by="sortBy()" cols="12" sm="12" md="6">
            <template v-slot:default="{ items }">
                <ProfileShippingAddressCard v-for="(item, i) in items" :key="i.alias" :value="i.alias" :address="item.raw"
                    @delete-address="deleteAddress(i)" @edit-address="toggleDialog(i)">
                </ProfileShippingAddressCard>
            </template>
        </v-data-iterator>
    </v-card>
</template>

<script>
import { saveUserProfile } from "@/services/profile";
import _ from 'lodash';

export default {
    props: {
        profile: { type: Object, default: undefined },
        mode: { type: String, default: undefined },
        loading: { type: Boolean, default: true },
    },
    computed: {
        showAddButton() {
            return (this.profile.shipping?.addresses?.length || 0) < this.maxAllowedAddresses;
        }
    },
    created() {
        if (!this.profile.shipping) {
            this.profile.shipping = { useBillingAddress: false };
            this.profile.shipping.addresses = [];
        }
    },
    methods: {
        toBillingInfo() {
            navigateTo(`${useAppConfig().routes.accountProfile}?expand=billingInfo`);
        },
        toggleDialog(index) {
            this.dialog = !this.dialog;
            this.editedAddress = index != undefined ? this.profile.shipping.addresses[index] : undefined;
        },
        async deleteAddress(index) {
            this.loading = true;
            this.profile.shipping.addresses.splice(index, 1);

            const s = this.profile.shipping;
            if (!s.useBillingAddress) {
                if (!s.addresses || s.addresses.length == 0) {
                    this.profile.shipping.useBillingAddress = true;
                }
                else {
                    if (!s.addresses.some(a => a.isDefault)) {
                        this.profile.shipping.addresses[0].isDefault = true;
                    }
                }
            }
            await saveUserProfile(this.profile);
            this.loading = false;
            this.$emit("profile-updated")
        },
        sortBy() {
            return [
                { key: "isDefault", order: 'desc' },
            ];
        },
        async useBillingAddress() {
            this.loading = true;
            this.profile.shipping.useBillingAddress = true;
            this.profile.shipping.addresses.forEach(a => a.isDefault = false);

            await saveUserProfile(this.profile);
            this.loading = false;
            this.$emit("saved");
        },
        async addressSaved(address) {
        },
    },
    data: () => {
        return {
            dialog: false,
            editedAddress: undefined,
            loading: false,
            maxAllowedAddresses: 3,
            valid: false,
        }
    }
}
</script>