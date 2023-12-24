import { usePageStore } from "@/stores/page";
export default defineNuxtRouteMiddleware((to, from) => {
    useAlertStore().clearAlarmType("dialog");
    usePageStore().$reset();
})
