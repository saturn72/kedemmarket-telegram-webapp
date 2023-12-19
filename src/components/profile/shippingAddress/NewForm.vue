
<template>
    <v-dialog v-click-outside="toggleDialog" v-model="dialog">
        <v-card>
            <v-card-title>
                <v-icon>mdi-truck-fast-outline</v-icon>&nbsp;{{ $t('addAddress') }}
            </v-card-title>
            <v-card-text>
                <v-form ref="form" @update:modelValue="updated">
                    <ProfileShippingAddressNewFormFields :address="newAddress"></ProfileShippingAddressNewFormFields>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn variant="flat" block :disabled="!valid" color="info" @click="save()">
                    <v-icon>mdi-content-save-outline</v-icon>&nbsp;{{ $t('save') }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <v-btn variant="outlined" color="info" block @click="toggleDialog">
        <v-icon size="x-large">mdi-plus-circle-outline</v-icon>&nbsp;{{ $t("addAddress") }}
    </v-btn>
</template>
<script>
export default {
    props: {
        profile: { type: Object, default: undefined }
    },
    data() {
        return {
            dialog: false,
            newAddress: {},
            valid: false,
        };
    },
    methods: {
        async toggleDialog() {
            this.dialog = !this.dialog
            if (this.dialog) {
                console.log(this.$refs.form);
                const { valid } = await this.$refs.form.validate();
                this.valid = valid;
            }
        },
        updated(e) {
            this.valid = e;
        },
    }
}
</script>