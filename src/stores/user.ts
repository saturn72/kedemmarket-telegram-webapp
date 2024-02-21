import { defineStore } from 'pinia'
import _ from 'lodash';

type UserState = {
    user?: any | undefined,
    anonymousUserId?: string | undefined
}

export const useUserStore = defineStore('user', {

    state: (): UserState => {
        return {
            user: undefined,
            anonymousUserId: undefined,
        };
    },
    getters: {
        getUser(state): any {
            return state.user
        },
        getAnonymousUserId(state): string | undefined {
            return state.anonymousUserId;
        },
    },
    actions: {
        setUser(user: any): void {
            this.$state.user = user;
        },
        setAnonymousUserId(uid: string): void {
            this.$state.anonymousUserId = uid;
        },
        logout() {
            useNuxtApp().$user.logout();
        },
    },
    persist: {
        storage: persistedState.localStorage
    }
})