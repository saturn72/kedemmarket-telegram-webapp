<template>
    <v-text-field outlined prepend-inner-icon="mdi-magnify" :label="$t('productSearch')" clearable persistent-clear
        v-model="search" :loading="loading" density="comfortable" @update:model-value="updated" hide-no-data hide-details>
    </v-text-field>
</template>

<script>
import { useSearchStore } from '@/stores/search';

export default {
    mounted() {
        this.search = useSearchStore().search;
        this.updated(this.search);
    },
    methods: {
        updated(value) {
            if (useSearchStore().search != value) {
                useSearchStore().setSearch(value);
            }

            this.loading = true
            this.$emit('onSearchUpdated', value);
            this.loading = false
        }
    },
    data() {
        return {
            loading: false,
            search: undefined,
        }
    }
}
</script>