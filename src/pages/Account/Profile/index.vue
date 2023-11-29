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
            <v-container>
                <v-row>
                    <v-col cols="12" md="6" v-for="item in items" :key="item.route">
                        <v-card @click="onClick(item)">
                            <v-card-title class="d-flex justify-center">
                                <v-icon>{{ item.icon }}</v-icon>
                                &nbsp;
                                {{ $t(item.displayText) }}
                                <v-spacer></v-spacer>
                            </v-card-title>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script>
import { getUserProfile } from "@/services/profile";
import account from './../account';

export default {
    async created() {
        this.loading = true;
        this.profile = await getUserProfile();
        this.loading = false;
    },
    data: () => ({
        items: [{ icon: "mdi-account-multiple-outline", displayText: 'linkAccounts' }],
        loading: true,
        menu: account.profile,
        profile: {
        },

    }),
    methods: {
        methods: {
            onClick(item) {
                if (item.onClick) {
                    item.onClick()
                }
                else {
                    navigateTo(item.route);
                }
            }
        }
    }
}
</script>