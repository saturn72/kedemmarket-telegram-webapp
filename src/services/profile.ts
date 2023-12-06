import { useUserStore } from "@/stores/user";
import defu from "defu";
import type { UserProfile } from "@/models/account";


const cachingTime = 10 * 60;

const userProfileCacheKey = (): string => {
    const userId = useUserStore().getUser.uid;
    return `userprofile:${userId}`.toLocaleLowerCase();
}

export async function getUserProfile(): Promise<UserProfile | null | undefined> {
    const key = userProfileCacheKey();
    return await useNuxtApp().$cache.getOrAcquire(key,
        async () => {
            var up = await useNuxtApp().$backend.getUserProfile();
            return alignWithUser(up);
        },
        cachingTime);
}

export async function saveUserProfile(profile: UserProfile): Promise<UserProfile | null | undefined> {
    const key = userProfileCacheKey();
    await useNuxtApp().$cache.remove(key);

    const up = await useNuxtApp().$backend.saveUserProfile(profile);

    const res = alignWithUser(up);
    await useNuxtApp().$cache.set(key, res, cachingTime);
    return res;
}


function alignWithUser(profile: UserProfile) {
    const curProfile = defu(profile, {
        billingAddress: {}
    });

    const user = useUserStore().getUser;
    if (user.displayName) {
        const arr = user.displayName.split(' ');

        if (!curProfile.billingAddress.firstName) {
            curProfile.billingAddress.firstName = arr[0];
        }
        if (arr.length > 1 && !curProfile.billingAddress.lastName) {
            curProfile.billingAddress.lastName = user.displayName.substring(arr[0].length + 1);
        }
    }

    if (user.phoneNumber) {
        if (!curProfile.billingAddress.phoneNumber) {
            curProfile.billingAddress.phoneNumber = user.phoneNumber;
        }
    }

    if (user.email) {
        if (!curProfile.billingAddress.email) {
            curProfile.billingAddress.email = user.email;
        }
    }
    return curProfile;
}