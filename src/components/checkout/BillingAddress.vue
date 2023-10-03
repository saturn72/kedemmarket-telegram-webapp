<template>
    <v-dialog persistent class="text-center" :model-value="show">
        <v-card height="80%">
            <v-card-title>{{ $t('billingAddress') }}</v-card-title>
            <v-card-text>

                <v-form ref="form">
                    <v-text-field v-model="firstName" :rules="nameRules" :label="$t('firstName')" required></v-text-field>
                    <v-text-field v-model="lastName" :rules="nameRules" :label="$t('lastName')" required></v-text-field>
                    <v-text-field v-model="address1" :rules="addressRules" :label="$t('address1')" required></v-text-field>
                    <v-text-field v-model="address2" :label="$t('address2')"></v-text-field>
                    <v-text-field v-model="city" :rules="cityRules" :label="$t('city')" required></v-text-field>
                    <v-text-field v-model="postalCode" :rules="postalCodeRules" :label="$t('postalCode')"></v-text-field>
                </v-form>
            </v-card-text>
            <v-col class="d-flex justify-center">
                Change to accordion
            </v-col>
        </v-card>
    </v-dialog>
</template>

<script>

export default {
    props: {
        show: { type: Boolean },
        billingAddress: { type: Object }
    }
}
</script>