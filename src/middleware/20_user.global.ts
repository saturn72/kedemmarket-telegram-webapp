import { getUserProfile } from "~/services/profile";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const profile = await getUserProfile();
    const profileExist = profile && profile != null;

    if (profileExist && !profile.billingAddress?.verified) {
        const txt = useNuxtApp().$t("updateBillingAddressIsRequired");
        const uri = `${useAppConfig().routes.accountProfile}?expand=billingAddress&mode=edit`;

        setTimeout(() => {
            navigateTo(uri);
            useAlertStore().setSnackbar(txt, 5000, 5000, true);
        }, 1000);
    }
})
