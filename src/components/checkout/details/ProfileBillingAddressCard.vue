<template>
    <v-card flat>
        <v-card-text>
            <v-form ref="form" @update:modelValue="updated">
                <ProfileBillingAddressFormFields :billingAddress="profile?.billingAddress" mode="edit" />
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn block variant="flat" :loading="loading" :disabled="loading || !modified" color="secondary"
                @click="approve()">{{
                    $t('approve')
                }}
            </v-btn>
        </v-card-actions> </v-card>
</template>

<script>
import _ from "lodash";

export default {
    props: {
        profile: { type: Object, default: undefined },
        loading: { type: Boolean, default: false }
    },
    created() {
        this.srcBillingAddress = _.cloneDeep(this.profile.billingAddress);
    },
    computed: {
        modified() {
            return !_.isEqual(this.srcBillingAddress, this.profile.billingAddress);
        }
    },
    data: () => {
        return {
            srcBillingAddress: undefined,
            billingAddress: undefined,
        }
    },
    methods: {
        updated(e) {
            this.valid = e;
        },
        approve() {
            this.$emit('saved_billing_address');
            this.srcBillingAddress = _.cloneDeep(this.profile.billingAddress);
        }
    }
}
</script>
