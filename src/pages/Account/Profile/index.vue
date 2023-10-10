<template>
    <v-card>
        <v-card-title class="d-flex justify-center">
            <v-icon>{{ menu.icon }}</v-icon>
            &nbsp;
            {{ $t(menu.displayText) }}
            <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>

            <h1>{{ ownsFirearm }}</h1>
            <v-radio-group v-model="ownFirearm" dir="rtl">
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
        </v-card-text>
        <v-card-actions>
            <v-btn variant="flat" :loading="loading" :disabled="loading" color="secondary" @click="save()">{{
                $t('save')
            }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="flat" @click="$router.back()">{{
                $t('cancel')
            }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { getProfile } from "@/services/profile";
import account from './../account';
export default {

    async created() {
        this.menu = account.profile;
        this.profile = await getProfile();
        console.log("this is user profile", this.profile)
    },
    data() {
        return {
            loading: false,
            menu: {},
            profile: {
                ownFirearm: undefined,
            }
        }
    },
}
</script>