
<template>
    <v-card v-click-outside="close" :loading="loading">
        <v-card-title>
            <v-row>
                <v-col>
                    <v-icon>mdi-truck-fast-outline</v-icon>&nbsp;{{ mode == 'edit' ? $t('addressEdit') : $t('addressAdd') }}
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="4">
                    <v-btn @click="close" block
                        color="info"><v-icon>mdi-arrow-left-circle-outline</v-icon><v-spacer></v-spacer>{{
                            $t('back') }}</v-btn>
                </v-col>
            </v-row>
        </v-card-title>
        <v-card-text>
            <v-form ref="form" @update:modelValue="updated">
                <ProfileShippingAddressAddOrEditFormFields :address="newAddress" :profile="profile" :mode="mode">
                </ProfileShippingAddressAddOrEditFormFields>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn variant="flat" block :disabled="!valid || !modified" color="info" @click="addOrUpdateAddress">
                <v-icon>mdi-content-save-outline</v-icon>&nbsp;{{ $t('save') }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
import _ from "lodash";
import { saveUserProfile } from "@/services/profile";

export default {
    props: {
        profile: { type: Object, default: undefined },
        address: { type: Object, default: undefined },
    },
    mounted() {
        this.newAddress = {};

        if (this.address) {
            this.newAddress = _.cloneDeep(this.address);
            this.mode = "edit"
        }
    },
    data() {
        return {
            loading: false,
            mode: "edit" | undefined,
            newAddress: {},
            valid: false,
        };
    },
    computed: {
        modified() {
            return !_.isEqual(this.address, this.newAddress);
        }
    },
    methods: {
        updated(e) {
            this.valid = e;
        },
        async addOrUpdateAddress() {
            this.loading = true;

            if (this.address) {
                const index = this.profile.shipping.addresses.find(x => x.alias == this.address.alias);
                this.profile.shipping.addresses.splice(index, 1);
            }

            if (this.newAddress.isDefault) {
                this.profile.shipping.useBillingAddress = false;
                this.profile.shipping.addresses.forEach((e, i) => {
                    this.profile.shipping.addresses[i].isDefault = false;
                });
            }

            this.profile.shipping.addresses.push(this.newAddress);
            await saveUserProfile(this.profile);

            this.close();
            this.newAddress = undefined;
            this.$emit('address-saved', this.newAddress)
            this.loading = false;
        },
        close() {
            this.newAddress = undefined;
            this.$emit('on-cancel');
        }
    }
}
</script>