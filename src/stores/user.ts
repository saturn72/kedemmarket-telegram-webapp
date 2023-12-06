import { defineStore } from 'pinia'
import _ from 'lodash';
import { useBackendFetch } from '~/services/backend';

type UserState = {
    user?: any | undefined,
    profile?: any | undefined,
}

const getFromStorageOrDefault = (key: string): any | undefined => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : undefined
};

export const useUserStore = defineStore('user', {
    state: (): UserState => {
        return {
            user: undefined, //getFromStorageOrDefault('user'),
            profile: undefined, // getFromStorageOrDefault('user_profile'),
        };
    },
    getters: {
        getUser(state): any {
            return state.user
        },
    },
    actions: {
        setUser(user: any): void {
            this.$state.user = user;
            useBackendFetch(`customer/profile/${user.uid}`, { method: "GET" })
                .then(res => {
                    const d = res.data;
                    if (!d.billingAddress || d.billingAddress == null) {
                        const text = useNuxtApp().$t("missingBillingAddress");
                        const o = {
                            duration: 30000,
                            timeBetweenAlerts: 30 * 60 * 60 * 1000,
                            action: {
                                text: useNuxtApp().$t("update"),
                                func: () => navigateTo("/account/profile/billingAddress")
                            }
                        };
                        useAlertStore().setAlarm("snackbar", text, o);
                    }
                    this.$state.profile = d;
                });
        },
        logout() {
            useNuxtApp().$user.logout();
            this.$state.user = undefined;
            this.$state.profile = undefined;
            navigateTo(useAppConfig().routes.home);
        },
    },
    persist: {
        storage: persistedState.localStorage
    }
})