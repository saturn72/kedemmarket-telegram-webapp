
<template>
    <v-text-field v-for="item in items" :label="$t(item.label)" :prepend-inner-icon="item.icon" :readonly="!editable"
        v-model="billingInfo[item.key]" density="compact" :type="item.type" :rules="item.rules"
        :loading="!billingInfo && !(!!billingInfo[item.key])"></v-text-field>
</template>

<script>

export default {
    props: {
        editable: { type: Boolean, default: true },
        billingInfo: { type: Object, default: {} }
    },
    created() {
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
    methods: {
        requiredRule(key) {
            return [() => !!this.billingInfo[key] || `${this.$t(key)}  ${this.$t('isRequired')}`]
        }
    },
    data: () => {
        return {
            items: [],
        }
    }
}
</script>