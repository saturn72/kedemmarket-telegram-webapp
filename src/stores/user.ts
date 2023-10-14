import { defineStore } from 'pinia'
import _ from 'lodash';

type UserState = {
    user?: any | undefined,
}

const getFromStorageOrDefault = (key: string): any | undefined => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : undefined
};

export const useUserStore = defineStore('user', {

    state: (): UserState => {
        return {
            user: getFromStorageOrDefault('user')
        };
    },
    getters: {
        getUser(state): any {
            return state.user
        }
    },
    actions: {
        setUser(user: any): void {
            this.$state.user = user;
        },
        logout() {
            useNuxtApp().$user.logout();
        }
    },
    persist: {
        storage: persistedState.localStorage
    }
})