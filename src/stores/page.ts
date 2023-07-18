import { defineStore } from 'pinia'

type PageState = {
    header?: string | undefined
}

export const usePageStore = defineStore('page', {
    state: (): PageState => { return {} },
    actions: {
        async setHeader(header: string): Promise<void> {
            this.header = header;
        },
    },
})