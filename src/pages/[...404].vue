<template>
    <div class="mt-7 max-w-sm mx-auto text-center card">
        <p class="mt-7 text-6xl font-bold">
        <h1>{{ $t('Ooops.') }}</h1>
        </p>
        <p class="mt-7">
        <h2>
            {{ $t('Failed to find page...') }}
        </h2>
        </p>
        <p>
            <v-btn @click="onBackClicked()">
                {{ $t('Back') }}
            </v-btn>
        </p>
    </div>
</template>
<script>
export default {
    methods:
    {
        onBackClicked() {
            const route = useRoute().redirectedFrom ?? useAppConfig().defaults.storeRoute;
            this.$router.push(route);
        }
    }
}
</script>
    