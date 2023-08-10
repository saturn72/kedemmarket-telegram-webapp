import { usePageStore } from "@/stores/page";
export default defineNuxtRouteMiddleware((to, from) => {
    usePageStore().$reset();
})
