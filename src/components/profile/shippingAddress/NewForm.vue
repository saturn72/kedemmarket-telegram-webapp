
<template>
    <v-dialog v-click-outside="toggleDialog" v-model="dialog">
        <v-card :loading="loading">
            <v-card-title>
                <v-icon>mdi-truck-fast-outline</v-icon>&nbsp;{{ $t('addAddress') }}
            </v-card-title>
            <v-card-text>
                <v-form ref="form" @update:modelValue="updated">
                    <ProfileShippingAddressNewFormFields :address="address" :profile="profile">
                    </ProfileShippingAddressNewFormFields>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn variant="flat" block :disabled="!valid" color="info" @click="addAddress">
                    <v-icon>mdi-content-save-outline</v-icon>&nbsp;{{ $t('save') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-btn variant="outlined" color="info" block @click="toggleDialog">
        <v-icon size="x-large">mdi-plus-circle-outline</v-icon>&nbsp;{{ $t("addAddress") }}
    </v-btn>
</template>
<script>

import { saveUserProfile } from "@/services/profile";

export default {
    props: {
        profile: { type: Object, default: undefined }
    },
    data() {
        return {
            dialog: false,
            address: {},
            valid: false,
            loading: false,
        };
    },
    methods: {
        async toggleDialog() {
            this.dialog = !this.dialog
            if (this.dialog) {
                this.address = { isDefault: true };
            }
        },
        updated(e) {
            this.valid = e;
        },
        async addAddress() {
            this.loading = true;
            if (this.address.isDefault) {
                this.profile.shipping.useBillingAddress = false;
                this.profile.shipping.addresses.forEach((e, i) => {
                    this.profile.shipping.addresses[i].isDefault = false;
                });
            }
            this.profile.shipping.addresses.push(this.address);
            await saveUserProfile(this.profile);

            this.toggleDialog();
            this.$emit('address-saved', this.address)
            this.loading = false;
        }
    }
}
</script>