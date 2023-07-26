import { useUserStore } from "@/stores/user";

const loginRoute = '/login'

export default defineNuxtRouteMiddleware((to, from) => {

    if (to.path !== loginRoute && !useUserStore().user) {
        console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
        return navigateTo(`${loginRoute}?redirectUrl=${to.fullPath}`);
    }

    if (to.path == loginRoute && useUserStore().user) {
        console.log("lllllllllllllllllllllllllll")
        return navigateTo("/");
    }
})
