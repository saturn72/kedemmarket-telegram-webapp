
<template>
    <v-card flat>
        <v-card-actions>
            <v-row>
                <v-col>
                    <v-btn variant="flat" block :color="updateColor" @click="toggleUpdate()" :disabled="loading">
                        <v-icon>{{ updateIcon }}</v-icon>&nbsp;{{ updateText }}
                    </v-btn>
                </v-col>
                <v-col v-if="update">
                    <v-btn variant="flat" block :disabled="!modified || !valid || loading" :loading="loading" color="info"
                        @click="save()">
                        <v-icon>mdi-content-save-outline</v-icon>&nbsp;{{ $t('save') }}
                    </v-btn></v-col>
            </v-row>
        </v-card-actions>
        <v-card-text>
            <v-form ref="form" @update:modelValue="updated">
                <ProfileBillingAddressFields :billingAddress="billingAddress" :editable="!readonly" />
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
        this.srcBillingAddress = _.cloneDeep(this.profile.billingAddress);
        this.billingAddress = _.cloneDeep(this.profile.billingAddress);
        this.reset();
    },
    mounted() {
        if (this.mode == "edit") {
            this.toggleUpdate();
        }
    },
    computed: {
        readonly() {
            return (this.profile?.billingAddress && !this.update) || false;
        },
        modified() {
            const src = _.cloneDeep(this.srcBillingAddress);
            return !_.isEqual(src, this.billingAddress);
        }
    },
    methods: {
        updated(e) {
            this.valid = e;
        },
        requiredRule(key) {
            return [() => !!this.billingAddress[key] || `${this.$t(key)}  ${this.$t('isRequired')}`]
        },
        async toggleUpdate() {
            if (this.update) {
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
            this.updateIcon = "mdi-pencil";
            this.updateText = this.$t('update');
            this.updateColor = "secondary";
            this.$refs.form?.resetValidation();
        },
        async save() {
            this.loading = true;
            this.profile.billingAddress = this.billingAddress;
            await saveUserProfile(this.profile);
            this.loading = false;
            this.update = false;
            this.reset();
            this.$emit("saved");
        }
    },
    data: () => {
        return {
            valid: false,
            billingAddress: {},
            srcBillingAddress: {},
            loading: false,
            update: false,
            updateIcon: "",
            updateText: '',
            updateColor: "",
        }
    }
}
</script>