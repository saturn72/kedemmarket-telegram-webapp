<template>
    <v-card height="100%" flat class="d-flex flex-column justify-center">
        <v-card-title v-if="loading || calculating" class="d-flex flex-column align-center justify-center">
            <v-progress-circular indeterminate width="1"></v-progress-circular>
        </v-card-title>
        <v-card-title v-else class="d-flex justify-center">
            <v-icon>{{ menu.icon }}</v-icon>
            &nbsp;
            {{ $t(menu.displayText) }}
            <v-spacer></v-spacer>
        </v-card-title>

        <v-card-text v-if="!loading">
            <v-expansion-panels multiple>
                <v-expansion-panel value="billingAddress">
                    <template v-slot:title>
                        <v-icon>mdi-map-marker-outline</v-icon>&nbsp;{{ $t('billingAddress') }}
                    </template>

                    <v-expansion-panel-text>
                        <ProfileBillingAddress :profile="profile">
                        </ProfileBillingAddress>
                    </v-expansion-panel-text>

                </v-expansion-panel>
            </v-expansion-panels>
        </v-card-text>
    </v-card>
</template>

<script>
import { getUserProfile } from "@/services/profile";
import account from './../account';

export default {
    async created() {
        this.menu = account.profile;
        this.loading = true;
        this.profile = await getUserProfile();
        this.loading = false;
    },
    data: () => ({
        saving: false,
        loading: true,
        menu: {},
        profile: {},
    })
}
</script>