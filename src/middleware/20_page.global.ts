export default defineNuxtRouteMiddleware((to, from) => {
    useAlertStore().clearAlarmType("dialog");
    usePageStore().$reset();
    useStructuredDataStore().clearValue();
})

