
<template>
    <v-switch density="compact" :label="$t('defaultAddress')" color="primary" v-model="address.isDefault"></v-switch>

    <v-text-field class="mb-n2" v-for="item in items" :label="$t(item.label)" :prepend-inner-icon="item.icon"
        v-model="address[item.key]" density="compact" :type="item.type" :rules="item.rules"
        :loading="!address && !(!!address[item.key])"></v-text-field>
</template>

<script>

export default {
    props: {
        address: { type: Object, default: {} },
        profile: { type: Object, default: {} },
        mode: { type: String, default: undefined }
    },
    created() {
        this.items = [{
            label: 'addressAlias',
            key: 'alias',
            icon: "mdi-pencil-outline",
            type: "text",
            rules: this.aliasRules()
        }, {
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
            return [() => !!this.address[key] || `${this.$t(key)}  ${this.$t('isRequired')}`]
        },
        aliasRules() {
            return [
                this.requiredRule("alias"),
                () => (!!this.address.alias && this.checkAlias())
                    || `${this.$t('addressAlias')}  ${this.$t('isRequired')}`]
        },
        checkAlias() {
            var hasSameAlias = this.profile.shipping.addresses.filter(x => x.alias?.trim() == this.address.alias.trim()).length
            return this.mode == "edit" ? hasSameAlias <= 1 : hasSameAlias == 0;
        }
    },
    data: () => {
        return {
            items: [],
        }
    }
}
</script>