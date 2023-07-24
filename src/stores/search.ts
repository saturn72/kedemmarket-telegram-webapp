import { Queue } from '@/services/dataStructures';
import { defineStore } from 'pinia'
import _ from 'lodash';

type SearchState = {
    search?: string | undefined;
}

const queue = new Queue<string>();

export const useSearchStore = defineStore('search', {
    state: (): SearchState => { return {} },
    actions: {
        async setSearch(searchToSet: string): Promise<void> {
            this.search = searchToSet;
            if (this.search && this.search.trim().length > 0) {
                queue.enqueue(this.search);
            }
        },
    },
    persist: {
        storage: persistedState.sessionStorage
    }
})