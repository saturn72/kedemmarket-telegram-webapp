import { useUserStore } from "@/stores/user";


export default defineNuxtRouteMiddleware((to, from) => {
    const loginRoute = useAppConfig().routes.login;
    const user = useUserStore().user;

    if (to.path !== loginRoute && !user) {
        return navigateTo(`${loginRoute}?redirectUrl=${to.fullPath}`);
    }

    if (to.path == loginRoute && user) {
        return navigateTo(useAppConfig().routes.home);
    }
    navigateTo(loginRoute);
})
