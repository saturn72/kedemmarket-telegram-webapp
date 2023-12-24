
<template>
    <v-dialog v-click-outside="resetDeleteAddress" v-model="dialog" width="auto" class="text-center">
        <v-card>
            <v-card-text>{{ dialogText }}</v-card-text>
            <v-card-actions>
                <v-btn color="warning" @click="onConfirmDeleteAddress">{{ $t('confirm') }}</v-btn>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="dialog = false">{{ $t('cancel') }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-divider></v-divider>

    <v-card flat :loading="loading">
        <v-card-title>{{ address.alias }}
        </v-card-title>
        <v-card-actions>
            <v-row>
                <v-btn icon="mdi-pencil-outline" @click="editAddress"></v-btn>
                <v-btn icon="mdi-delete-outline" @click="dialog = true"></v-btn>
                <v-spacer></v-spacer>
                <v-switch v-if="address.isDefault" :label="$t('defaultAddress')" color="primary" v-model="address.isDefault"
                    true-icon="mdi-check-outline" readonly density="compact">
                </v-switch>
            </v-row>
        </v-card-actions>
        <v-card-text>
            <v-text-field v-for="item in items" :label="$t(item.label)" :prepend-inner-icon="item.icon"
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
    mounted() {
        const t = this.$t('deleteAddress');
        this.dialogText = t.replace("##0##", this.address.alias)
    },
    methods: {
        editAddress() {
            this.$emit("edit-address");
        },
        onConfirmDeleteAddress() {
            this.dialog = false;
            this.$emit("delete-address");
        },
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