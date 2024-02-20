import { useUserStore } from "@/stores/user";

export default defineNuxtRouteMiddleware((to, from) => {
    const user = useUserStore().user;
    const shouldLogin = !user || user == null || user.isAnonymous;

    if (shouldLogin) {
        return navigateTo(`${useAppConfig().routes.login}?returnUrl=${to.fullPath}`);
    }
})
