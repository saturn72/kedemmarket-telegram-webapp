<template>
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

        <v-text-field :label="$t('city')" prepend-inner-icon="mdi-city" :readonly="readonly" v-model="billingAddress.city"
            density="compact"></v-text-field>

        <v-text-field :label="$t('zipPostalCode')" prepend-inner-icon="mdi-post-outline" :readonly="readonly"
            v-model="billingAddress.zipPostalCode" density="compact"></v-text-field>
    </v-form>
</template>

<script setup>
</script>

<script>
export default {
    props: {
        edit: { type: Boolean, default: false },
        profile: { type: Object, default: undefined }
    },
    computed: {
        readonly() {
            return (this.profile?.billingAddress && !this.edit) || false;
        }
    },
    data: () => {
        return {
            billingAddress: {
                firstName: undefined,
                lastName: undefined,
                company: undefined,
                phoneNumber: undefined,
                email: undefined,
                address1: undefined,
                address2: undefined,
                zipPostalCode: undefined,
                city: undefined,
            }
        }
    }
}
</script>