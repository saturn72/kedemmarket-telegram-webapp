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
            <v-expansion-panels v-model="panels" multiple>
                <v-expansion-panel value="billingAddress">
                    <template v-slot:title>
                        <v-icon>mdi-map-marker-outline</v-icon>{{ $t('billingAddress') }}
                        <v-spacer></v-spacer>
                    </template>

                    <v-expansion-panel-text>
                        <v-card flat>
                            <v-card-text>
                                <ProfileBillingAddress :profile="profile" :edit="edit['billingAddress']">
                                </ProfileBillingAddress>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn variant="flat" block color="secondary" @click="toggleEdit('billingAddress')">
                                    <v-icon>
                                        mdi-pencil
                                    </v-icon>
                                    {{ $t('update') }}
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-expansion-panel-text>

                </v-expansion-panel>
            </v-expansion-panels>
        </v-card-text>
    </v-card>
    <!-- <v-card-actions>
            <v-btn variant="flat" :loading="loading || saving" :disabled="loading || !valid" color="secondary"
                @click="save()">{{
                    $t('save')
                }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="outlined" color="warning" @click="$router.back()">{{
                $t('cancel')
            }}
            </v-btn>
        </v-card-actions> -->
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
        panels: [],
        edit: {},
        saving: false,
        valid: true,
        loading: true,
        menu: {},
        profile: {
        },

        ownsFirearmRules: [],

    }),
    methods: {
        toggleEdit(key) {
            this.edit[key] = !this.edit[key];
        },
        isExpanded(value) {
            return this.panels.some(x => x == value);
        }
    }
}
</script>