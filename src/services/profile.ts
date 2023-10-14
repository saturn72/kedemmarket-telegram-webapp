import { useUserStore } from "@/stores/user";
import defu from "defu";
import { UserProfile } from "models/account";

const profileDefaults = {
};

const cachingTime = 10 * 60;

const userProfileCacheKey = (): string => {
    const userId = useUserStore().getUser.uid;
    return `userprofile:${userId}`.toLocaleLowerCase();
}

export async function getUserProfile(): Promise<UserProfile | null | undefined> {
    const key = userProfileCacheKey();
    const p = await useNuxtApp().$cache.getOrAcquire(key,
        async () => await useNuxtApp().$backend.getUserProfile(),
        cachingTime);
    return defu(p, profileDefaults);
}

export async function saveUserProfile(profile: UserProfile): Promise<UserProfile | null | undefined> {
    const key = userProfileCacheKey();
    await useNuxtApp().$cache.remove(key);
    const p = await useNuxtApp().$backend.saveUserProfile(profile);
    const res = defu(p, profileDefaults);

    await useNuxtApp().$cache.set(key, res, cachingTime);
    return res;
}
