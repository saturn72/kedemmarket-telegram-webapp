<template>
    <v-card flat>
        <v-card-text>
            <v-form ref="form" @update:modelValue="updated">
                <ProfileBillingInfoFormFields :billingInfo="profile?.billingInfo" editable="editable" />
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-btn block variant="flat" :loading="loading" :disabled="loading || !valid" color="secondary"
                @click="approve()">{{
                    $t('approve')
                }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import _ from "lodash";

export default {
    props: {
        profile: { type: Object, default: undefined },
        loading: { type: Boolean, default: false }
    },
    async mounted() {
        const { valid } = await this.$refs.form?.validate()
        this.valid = valid || false;
        this.srcBillingInfo = _.cloneDeep(this.profile.billingInfo);
    },
    data: () => {
        return {
            valid: undefined,
            srcBillingInfo: undefined,
            billingInfo: undefined,
        }
    },
    methods: {
        updated(e) {
            this.valid = e;
        },
        approve() {
            const modified = !_.isEqual(this.srcBillingInfo, this.profile.billingInfo);
            this.$emit('saved_billing_info', modified);
        }
    }
}
</script>
