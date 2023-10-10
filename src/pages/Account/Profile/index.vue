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
            <v-form v-model="valid">
                <v-card>
                    <v-radio-group v-model="profile.ownsFirearm" :rules="ownsFirearmRules">
                        <template v-slot:label>
                            <div> <v-icon>mdi-pistol</v-icon>{{ $t('ownsFirearm') }}</div>
                        </template>
                        <v-radio value="true">
                            <template v-slot:label>
                                {{ $t('iOwnFirearm') }}
                            </template>
                        </v-radio>
                        <v-radio value="false">
                            <template v-slot:label>
                                {{ $t('iDoNotOwnFirearm') }}
                            </template>
                        </v-radio>
                    </v-radio-group>
                </v-card>
            </v-form>
        </v-card-text>
        <v-card-actions>
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
        </v-card-actions>

    </v-card>
</template>

<script>
import { getUserProfile, saveUserProfile } from "@/services/profile";
import account from './../account';

export default {
    async created() {
        this.ownsFirearmRules = [
            value => value != undefined || this.$t('requiredField')
        ];

        this.menu = account.profile;
        this.loading = true;
        this.profile = await getUserProfile();
        this.loading = false;
    },
    data: () => ({
        saving: false,
        valid: true,
        loading: true,
        menu: {},
        profile: {
        },

        ownsFirearmRules: [],

    }),
    methods: {
        async save() {
            this.saving = true;
            this.profile = await saveUserProfile(this.profile);
            this.saving = false;
        }
    }
}
</script>