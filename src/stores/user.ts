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
    actions: {
        setUser(user: any): void {
            this.$state.user = user;
        },
    },
    persist: {
        storage: persistedState.localStorage
    }
})