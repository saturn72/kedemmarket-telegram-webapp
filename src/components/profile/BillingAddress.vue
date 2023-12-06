
import type { log } from 'console';

import type { profile } from 'console';

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
                    <v-btn variant="flat" block :disabled="!valid || loading" :loading="loading" color="info"
                        @click="save()">
                        <v-icon>mdi-content-save-outline</v-icon>&nbsp;{{ $t('save') }}
                    </v-btn></v-col>
            </v-row>
        </v-card-actions>
        <v-card-text>
            <v-form>
                <v-text-field :label="$t('firstName')" prepend-inner-icon="mdi-account-outline" :readonly="readonly"
                    v-model="billingAddress.firstName" density="compact"></v-text-field>

                <v-text-field :label="$t('lastName')" prepend-inner-icon="mdi-account-outline" :readonly="readonly"
                    v-model="billingAddress.lastName" density="compact"></v-text-field>

                <v-text-field :label="$t('company')" prepend-inner-icon="mdi-domain" :readonly="readonly"
                    v-model="billingAddress.company" density="compact"></v-text-field>

                <v-text-field :label="$t('phoneNumber')" prepend-inner-icon="mdi-phone-outline" :readonly="readonly"
                    v-model="billingAddress.phoneNumber" density="compact"></v-text-field>

                <v-text-field :label="$t('email')" type="email" prepend-inner-icon="mdi-email-outline" :readonly="readonly"
                    v-model="billingAddress.email" density="compact"></v-text-field>

                <v-text-field :label="$t('address1')" prepend-inner-icon="mdi-map-marker-outline" :readonly="readonly"
                    v-model="billingAddress.address1" density="compact"></v-text-field>

                <v-text-field :label="$t('address2')" prepend-inner-icon="mdi-map-marker-outline" :readonly="readonly"
                    v-model="billingAddress.address2" density="compact"></v-text-field>

                <v-text-field :label="$t('city')" prepend-inner-icon="mdi-city" :readonly="readonly"
                    v-model="billingAddress.city" density="compact"></v-text-field>

                <v-text-field :label="$t('zipPostalCode')" prepend-inner-icon="mdi-post-outline" :readonly="readonly"
                    v-model="billingAddress.zipPostalCode" density="compact"></v-text-field>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script>
import { saveUserProfile } from "@/services/profile";

export default {
    props: {
        profile: { type: Object, default: undefined }
    },
    created() {
        this.reset();
    },
    computed: {
        readonly() {
            return (this.profile?.billingAddress && !this.update) || false;
        }
    },
    methods: {
        toggleUpdate() {
            if (this.update) {
                this.reset();
            } else {
                this.updateIcon = "mdi-close-circle-outline";
                this.updateText = this.$t('cancel');
                this.updateColor = "error";
            }
            this.update = !this.update;
        },
        reset() {
            this.billingAddress = this.profile.billingAddress;
            this.updateIcon = "mdi-pencil";
            this.updateText = this.$t('update');
            this.updateColor = "secondary";
        },
        async save() {
            this.loading = true;
            this.profile.billingAddress = this.billingAddress;
            await saveUserProfile(this.profile);
            this.loading = false;
            this.update = false;
            this.reset();
        }
    },
    data: () => {
        return {
            billingAddress: {},
            loading: false,
            valid: true,
            update: false,
            updateIcon: "",
            updateText: '',
            updateColor: "",
        }
    }
}
</script>