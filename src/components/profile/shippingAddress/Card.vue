
<template>
    <v-card flat>
        <v-card-title>{{ address.alias }}
        </v-card-title>
        <v-card-subtitle>
            <v-switch v-if="address.isDefault" :label="$t('setAsDefaultAddress')" color="primary"
                v-model="address.isDefault"></v-switch>
        </v-card-subtitle>
        <v-card-text>
            <v-text-field v-for="item in items" :label="$t(item.label)" :prepend-inner-icon="item.icon"
                v-model="address[item.key]" density="compact" :type="item.type"></v-text-field>
        </v-card-text>
    </v-card>
</template>

<script>
export default {

    props: {
        address: { type: Object, default: undefined }
    }
    , data() {
        return {
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