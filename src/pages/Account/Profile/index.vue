<template>
    <v-card height="100%" flat class="d-flex flex-column justify-center">
        <v-card-title v-if="loading" class="d-flex flex-column align-center justify-center">
            <v-progress-circular indeterminate width="1"></v-progress-circular>
        </v-card-title>
        <v-card-title v-else class="d-flex justify-center">
            <v-icon>{{ menu.icon }}</v-icon>
            &nbsp;
            {{ $t(menu.displayText) }}
            <v-spacer></v-spacer>
        </v-card-title>

        <v-card-text v-if="!loading">
            <v-expansion-panels multiple v-model="panels">
                <v-expansion-panel value="billingInfo">
                    <template v-slot:title>
                        <v-icon>mdi-map-marker-account-outline</v-icon>&nbsp;{{ $t('billingInfo') }}
                    </template>

                    <v-expansion-panel-text>
                        <ProfileBillingInfoForm :profile="profile" :mode="mode" @saved="saved">
                        </ProfileBillingInfoForm>
                    </v-expansion-panel-text>

                </v-expansion-panel>
                <v-expansion-panel value="shippingAddresses">
                    <template v-slot:title>
                        <v-icon>mdi-truck-fast-outline</v-icon>&nbsp;{{ $t('shippingAddresses') }}
                    </template>

                    <v-expansion-panel-text>
                        <ProfileShippingAddresses :profile="profile" :mode="mode" :loading="loading"
                            @profile-updated="profileUpdated">
                        </ProfileShippingAddresses>
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
    watch: {
        "$route.query.expand"(expand) {
            this.panels = [expand];
        }
    },
    async created() {
        const expand = this.$route.query.expand;
        this.mode = this.$route.query.mode;
        if (expand) {
            this.panels.push(expand);
        }

        this.menu = account.profile;
        this.loading = true;
        this.profile = await getUserProfile();
        this.loading = false;
    },
    data: () => ({
        panels: [],
        saving: false,
        loading: true,
        menu: {},
        profile: {},
        mode: undefined
    }),
    methods: {
        async profileUpdated() {
            this.loading = true;

            //check if navigation is required
            const to = this.$route.query.returnUri;
            if (to) {
                navigateTo(to);
            }

            //update profile
            this.profile = await getUserProfile();
            this.loading = false;
        }
    }
}
</script>