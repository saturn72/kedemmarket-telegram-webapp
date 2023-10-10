import { useUserStore } from "@/stores/user";
import { UserProfile } from "models/account";

export async function getProfile(): Promise<UserProfile | null | undefined> {
    const userId = useUserStore().getUser.uid;
    const key = `userprofile:${userId}`.toLocaleLowerCase();

    return await useNuxtApp().$cache.getOrAcquire(key,
        async () => await useNuxtApp().$backend.getUserProfile(),
        10 * 60);
}
