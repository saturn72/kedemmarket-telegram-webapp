import { useUserStore } from "@/stores/user";
import _ from "lodash";
import type { UserProfile } from "@/models/account";
import type { Address } from "~/models/account";

const cachingTime = 10 * 60;

const userProfileCacheKey = (): string => {
    const userId = useUserStore().getUser.uid;
    return `userprofile:${userId}`.toLocaleLowerCase();
}

export async function getUserProfile(): Promise<UserProfile | null | undefined> {
    const key = userProfileCacheKey();

    const up = await useNuxtApp().$cache.getOrAcquire(key,
        async () => await useNuxtApp().$backend.getUserProfile(),
        cachingTime);
    return await validateUserProfile(up);
}


export async function saveUserProfile(profile: UserProfile): Promise<UserProfile | null | undefined> {
    const up = await useNuxtApp().$backend.saveUserProfile(profile);

    const key = userProfileCacheKey();
    await useNuxtApp().$cache.set(key, up, cachingTime);

    return await validateUserProfile(up);
}

const validateUserProfile = async (profile: UserProfile | null | undefined): Promise<UserProfile> => {
    if (!profile ||
        profile == null ||
        Object.keys(profile).length == 0 ||
        Object.keys(profile).some(k => k == "message")) {
        await useNuxtApp().$cache.remove(userProfileCacheKey());
        return alignWithUser(profile);
    }

    if (profile) {
        const valid = isAddressValid(profile?.billingInfo as Address);
        if (!profile.billingInfo) {
            profile.billingInfo = {};
        }
        profile.billingInfo.valid = valid || false;
    }
    return profile;
}

function notNullAndNotEmpty(str: string | undefined): boolean {
    return str != null && str?.trim().length > 0;
}

function isAddressValid(address: Address): boolean {
    return address && address != null &&
        notNullAndNotEmpty(address.address) &&
        notNullAndNotEmpty(address.city) &&
        notNullAndNotEmpty(address.email) &&
        notNullAndNotEmpty(address.fullName) &&
        notNullAndNotEmpty(address.phoneNumber);
}

function alignWithUser(profile: any | undefined): UserProfile {
    const defaultProfile = {
        billingInfo: {
        }
    };

    const curProfile = _.assign(defaultProfile, profile);

    const user = useUserStore().getUser;
    if (!curProfile.billingInfo.valid) {
        if (user.displayName) {
            curProfile.billingInfo.fullName = user.displayName;
        }

        if (user.phoneNumber) {
            if (!curProfile.billingInfo.phoneNumber) {
                curProfile.billingInfo.phoneNumber = user.phoneNumber;
            }
        }

        if (user.email) {
            if (!curProfile.billingInfo.email) {
                curProfile.billingInfo.email = user.email;
            }
        }
    }
    return curProfile;
}