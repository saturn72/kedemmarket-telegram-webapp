const loginRoute = '/login'

export default defineNuxtRouteMiddleware((to, from) => {
    if (!useNuxtApp().$user && to.path !== loginRoute) {
        return navigateTo(`${loginRoute}?redirectUrl=${to.fullPath}`);
    }
})
