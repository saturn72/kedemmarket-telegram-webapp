import { useUserStore } from "@/stores/user";
import defu from "defu";
import type { UserProfile } from "@/models/account";
import type { Address } from "~/models/account";


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

function notNullAndNotEmpty(str: string | undefined) {
    return str && str != null && str.trim().length > 0;
}

function isAddressValid(address: Address) {
    return address && address != null &&
        notNullAndNotEmpty(address.address) &&
        notNullAndNotEmpty(address.city) &&
        notNullAndNotEmpty(address.email) &&
        notNullAndNotEmpty(address.fullName) &&
        notNullAndNotEmpty(address.phoneNumber);
}
function alignWithUser(profile: UserProfile) {
    const curProfile = defu(profile, {
        billingAddress: {
            valid: isAddressValid(profile.billingAddress),
        }
    });

    const user = useUserStore().getUser;
    if (!curProfile.billingAddress.valid) {
        if (user.displayName) {
            curProfile.billingAddress.fullName = user.displayName;
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
    }
    return curProfile;
}