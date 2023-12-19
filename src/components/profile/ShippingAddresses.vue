
<template>
    <v-card flat>
        <v-card-actions>
            <v-row>
                <v-col>
                    <v-btn variant="outlined" block :disabled="profile.shippingAddresses.useBillingAddress || loading"
                        :loading="loading" color="info" @click="useBillingAddress()">
                        <v-icon>mdi-map-marker-account-outline</v-icon>&nbsp;{{ $t('useBillingAddress') }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-actions>
        <v-card-text>
            <v-form ref="form" @update:modelValue="updated">
                <ProfileBillingInfoFormFields :billingInfo="billingInfo" :editable="editable" />
            </v-form>
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
        if (!this.profile.shippingAddresses) {
            this.profile.shippingAddresses = { useBillingAddress: false };
        }

        this.srcBillingInfo = _.cloneDeep(this.profile.billingInfo);
        this.reset();
    },
    mounted() {
        if (this.mode == "edit") {
            this.toggleUpdate();
        }
    },
    computed: {
        editable() {
            return !this.profile?.billingInfo || this.update;
        },
        modified() {
            return !_.isEqual(this.srcBillingInfo, this.billingInfo);
        }
    },
    methods: {
        async useBillingAddress() {
            this.loading = true;
            this.profile.shippingAddresses.useBillingAddress = true;
            await saveUserProfile(this.profile);
            this.loading = false;
            this.$emit("saved");
        },
        updated(e) {
            this.valid = e;
        },
        async toggleUpdate() {
            if (this.update) {
                this.billingInfo = this.srcBillingInfo;
                this.reset();
            } else {
                this.updateIcon = "mdi-close-circle-outline";
                this.updateText = this.$t('cancel');
                this.updateColor = "error";

                const { valid } = await this.$refs.form.validate()
                this.valid = valid;
            }
            this.update = !this.update;
        },
        reset() {
            this.billingInfo = _.cloneDeep(this.profile.billingInfo);
            this.updateIcon = "mdi-pencil";
            this.updateText = this.$t('update');
            this.updateColor = "secondary";
            this.$refs.form?.resetValidation();
        },
    },
    data: () => {
        return {
            valid: false,
            billingInfo: {},
            srcBillingInfo: {},
            loading: false,
            update: false,
            updateIcon: "",
            updateText: '',
            updateColor: "",
        }
    }
}
</script>