
<template>
    <v-card :loading="loading" @click="$emit('click', address)">
        <v-card-title>{{ address.alias }}</v-card-title>
        <v-card-text>
            <v-switch :label="$t('defaultAddress')" color="primary" v-model="address.isDefault"
                true-icon="mdi-check-outline" readonly density="compact">
            </v-switch>
            <v-text-field variant="plain" v-for="item in items" :label="$t(item.label)" :prepend-inner-icon="item.icon"
                v-model="address[item.key]" density="compact" :type="item.type" readonly></v-text-field>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    props: {
        address: { type: Object, default: undefined },
        loading: { type: Boolean, default: false }
    },
    data() {
        return {
            dialog: false,
            dialogText: undefined,
            items: [
                {
                    label: 'fullName',
                    key: 'fullName',
                    icon: "mdi-account-outline",
                    type: "text",
                },
                {
                    label: 'phoneNumber',
                    key: 'phoneNumber',
                    icon: "mdi-phone-outline",
                    type: "text",
                },
                {
                    label: 'email',
                    key: 'email',
                    icon: "mdi-email-outline",
                    type: "email",
                },
                {
                    label: 'address',
                    key: 'address',
                    icon: "mdi-map-marker-outline",
                    type: "text",
                },
                {
                    label: 'city',
                    key: 'city',
                    icon: "mdi-city",
                    type: "text",
                },
                {
                    label: 'zipPostalCode',
                    key: 'zipPostalCode',
                    icon: "mdi-post-outline",
                    type: "text",
                }]
        }
    }
}
</script>