<template>
    <div id="firebaseui-auth-container"></div>
</template>
<script setup>
definePageMeta({
    layout: 'blank'
})
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
</script>

<script>
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

export default {
    mounted() {
        firebase.initializeApp(useAppConfig().firebase);

        const rUrl = useRoute().query.returnUrl || "./";
        var uiConfig = {
            signInSuccessUrl: rUrl,
            signInOptions: [
                { provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID, },
                { provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID, },
                { provider: firebase.auth.EmailAuthProvider.PROVIDER_ID, },
            ],
            credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
            callbacks: {
                signInSuccessWithAuthResult: async (authResult, redirectUrl) => {
                    return true;
                },
                uiShown: function () {
                    // document.getElementById('loader').style.display = 'none';
                }
            },
        };
        const ui = new firebaseui.auth.AuthUI(firebase.auth());
        ui.start('#firebaseui-auth-container', uiConfig);
    }
}
</script>