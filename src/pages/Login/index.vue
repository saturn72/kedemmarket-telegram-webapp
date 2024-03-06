<template>
    <v-card flat>
        <v-card-text>

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

        </v-card-text>

        <v-card-actions>
            <v-btn block prepend-icon="mdi-face-agent" variant="elevated" @click="toChat()">
                {{ $t('callSupport') }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>

import { useDisplay } from 'vuetify/lib/framework.mjs';
import firebase from 'firebase/compat/app';

import * as firebaseui from 'firebaseui'

import 'firebaseui/dist/firebaseui.css'
import { startChat } from '~/services/whatsapp';
import { EmailAuthProvider, GoogleAuthProvider, getAuth } from 'firebase/auth';
import {
    signInWithCredential,
} from 'firebase/auth';

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

        const query = useRoute().query;
        const rUrl = query.returnUrl ||
            query.signInSuccessUrl ||
            useAppConfig().routes.home;

        var uiConfig = {
            signInSuccessUrl: rUrl,
            signInOptions: [
                { provider: GoogleAuthProvider.PROVIDER_ID, },
                // {
                //     provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                //     recaptchaParameters: {
                //         type: 'image',
                //         size: 'invisible',
                //         badge: 'bottomleft'
                //     },
                //     defaultCountry: 'IL',
                //     defaultNationalNumber: '1234567890',
                //     whitelistedCountries: ['IL', '+972']
                // },
                { provider: EmailAuthProvider.PROVIDER_ID, },
            ],
            credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
            callbacks: {
                signInSuccessWithAuthResult: (authResult, redirectUrl) => {
                    return true;
                },
                signInFailure: async (error) => {
                    const result = await auth.getRedirectResult()
                    // For merge conflicts, the error.code will be
                    // 'firebaseui/anonymous-upgrade-merge-conflict'.
                    if (error.code != 'firebaseui/anonymous-upgrade-merge-conflict') {
                        return Promise.resolve();
                    }
                    // The credential the user tried to sign in with.
                    var cred = error.credential;
                    // Copy data from anonymous user to permanent user and delete anonymous
                    // user.
                    // ...
                    // Finish sign-in after data is copied.
                    const t = await signInWithCredential(auth, cred);
                }
            },
        };
        const fb = useAppConfig().firebase;
        firebase.initializeApp(fb);
        const auth = firebase.auth();
        const ui = new firebaseui.auth.AuthUI(auth);

        ui.start('#firebaseui-auth-container', uiConfig);
    }
}
</script>