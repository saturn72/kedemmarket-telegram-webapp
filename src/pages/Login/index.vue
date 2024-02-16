<template>
    <v-col class="d-flex justify-center my-10">
        <v-avatar :size="width" :image="useAppConfig().defaults.thumbnail"></v-avatar>
    </v-col>
    <div id="firebaseui-auth-container"></div>

    <p class="d-flex justify-center my-10">
        {{ $t('loginIsRequiredToContinue') }}
    </p>


    <p class="d-flex justify-center my-10" style="background-color: antiquewhite">
        {{ $t('loginIsRequiredToContinueWhy') }}
    </p>
    <v-btn block class="ma-10" prepend-icon="mdi-face-agent" variant="elevated" @click="toChat()">
        {{ $t('callSupport') }}
    </v-btn>
</template>

<script>

import { useDisplay } from 'vuetify/lib/framework.mjs';
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import { startChat } from '~/services/whatsapp';

export default {
    methods: {
        toChat() {
            const msg = useNuxtApp().$t("beginSupportChatMessage");
            startChat(msg);
        }
    },
    setup() {
        definePageMeta({
            layout: 'blank'
        });

        useHead({
            script: [
                {
                    src: "https://www.gstatic.com/firebasejs/ui/6.0.2/firebase-ui-auth__iw.js",
                    type: "text/javascript",
                    async: true,
                }],
            link: [{
                rel: "stylesheet",
                type: "text/css",
                href: "https://www.gstatic.com/firebasejs/ui/6.0.2/firebase-ui-auth-rtl.css",
                async: true
            }]
        });

        const width = Math.min(useDisplay().width.value, 250);
        return {
            width,
        };
    },

    mounted() {
        const fb = useAppConfig().firebase;
        firebase.initializeApp(fb);

        const rUrl = useRoute().query.returnUrl || "./";
        var uiConfig = {
            signInSuccessUrl: rUrl,
            signInOptions: [
                { provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID, },
                {
                    provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                    recaptchaParameters: {
                        type: 'image',
                        size: 'invisible',
                        badge: 'bottomleft'
                    },
                    defaultCountry: 'IL',
                    defaultNationalNumber: '1234567890',
                    whitelistedCountries: ['IL', '+972']
                },
                { provider: firebase.auth.EmailAuthProvider.PROVIDER_ID, },
            ],
            credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
            callbacks: {
                signInSuccessWithAuthResult: async (authResult, redirectUrl) => {
                    return true;
                },
            },
        };
        const ui = new firebaseui.auth.AuthUI(firebase.auth());
        ui.start('#firebaseui-auth-container', uiConfig);
    }
}
</script>