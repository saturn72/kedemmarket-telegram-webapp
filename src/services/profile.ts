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

    return await useNuxtApp().$cache.getOrAcquire(key,
        async () => {
            var up = await useNuxtApp().$backend.getUserProfile();
            return alignWithUser(up);
        },
        cachingTime);
}

export async function saveUserProfile(profile: UserProfile): Promise<UserProfile | null | undefined> {
    const up = await useNuxtApp().$backend.saveUserProfile(profile);
    const res = alignWithUser(up);

    const key = userProfileCacheKey();
    await useNuxtApp().$cache.set(key, res, cachingTime);

    return res;
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

function alignWithUser(profile: UserProfile): UserProfile {
    const defaultProfile = {
        billingInfo: {
        }
    };

    const curProfile = _.assign(defaultProfile, profile);
    curProfile.billingInfo.valid = isAddressValid(profile.billingInfo);

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