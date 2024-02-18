import { useUserStore } from "@/stores/user";

const authedPaths: string[] = [];
export default defineNuxtRouteMiddleware((to, from) => {
    const user = useUserStore().user;
    const shouldLogin = !user && authedPaths.includes(to.path);

    if (!shouldLogin) {
        return;
    }

    const loginRoute = useAppConfig().routes.login;
    if (shouldLogin) {
        return navigateTo(`${loginRoute}?redirectUrl=${to.fullPath}`);
    }

    if (to.path == loginRoute && user) {
        return navigateTo(useAppConfig().routes.home);
    }
    navigateTo(loginRoute);
})
