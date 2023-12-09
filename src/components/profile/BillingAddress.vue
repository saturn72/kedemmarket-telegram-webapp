
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
                <v-text-field v-for="item in items" :label="$t(item.label)" :prepend-inner-icon="item.icon"
                    :readonly="readonly" v-model="billingAddress[item.key]" density="compact" :type="item.type"
                    :rules="item.rules"></v-text-field>
            </v-form>
        </v-card-text>

        <!-- <v-card-actions>
            <v-btn v-if="update" variant="flat" block :disabled="!modified || !valid || loading" :loading="loading"
                color="info" @click="save()">
                <v-icon>mdi-content-save-outline</v-icon>&nbsp;{{ $t('save') }}
            </v-btn>
        </v-card-actions> -->
    </v-card>
</template>

<script>
import { saveUserProfile } from "@/services/profile";
import _ from 'lodash';

export default {
    props: {
        profile: { type: Object, default: undefined }
    },
    created() {
        this.srcBillingAddress = _.cloneDeep(this.profile.billingAddress);
        this.reset();

        this.items = [{
            label: 'fullName',
            key: 'fullName',
            icon: "mdi-account-outline",
            type: "text",
            rules: this.requiredRule("fullName")
        },
        {
            label: 'phoneNumber',
            key: 'phoneNumber',
            icon: "mdi-phone-outline",
            type: "text",
            rules: this.requiredRule("phoneNumber")
        },
        {
            label: 'email',
            key: 'email',
            icon: "mdi-email-outline",
            type: "email",
            rules: this.requiredRule("email")
        },
        {
            label: 'address',
            key: 'address',
            icon: "mdi-map-marker-outline",
            type: "text",
            rules: this.requiredRule("address")
        },
        {
            label: 'city',
            key: 'city',
            icon: "mdi-city",
            type: "text",
            rules: this.requiredRule("city")
        },
        {
            label: 'zipPostalCode',
            key: 'zipPostalCode',
            icon: "mdi-post-outline",
            type: "text",
            rules: []
        }];
    },
    mounted() {
        if (this.$route.query.mode == "edit") {
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
            this.billingAddress = _.cloneDeep(this.srcBillingAddress);
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
            items: [],
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