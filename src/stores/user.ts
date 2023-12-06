import { defineStore } from 'pinia'
import _ from 'lodash';

type UserState = {
    user?: any | undefined,
}

export const useUserStore = defineStore('user', {

    state: (): UserState => {
        return {
            user: undefined
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
        },
        logout() {
            useNuxtApp().$user.logout();
        },
    },
    persist: {
        storage: persistedState.localStorage
    }
})