import { defineStore } from 'pinia'

type StructureDataState = {
    value?: any | undefined
}

export const useStructuredDataStore = defineStore('structure-Data', {
    state: (): StructureDataState => { return {} },
    actions: {
        async setValue(value: any): Promise<void> {
            this.$state.value = value;
        },
    },
})