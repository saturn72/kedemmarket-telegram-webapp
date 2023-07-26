<template>
    <div class="mt-7 max-w-sm mx-auto text-center card">
        <p class="mt-7 text-6xl font-bold">
        <h1>{{ $t('ooops') }}</h1>
        </p>
        <p class="mt-7">
        <h2>
            {{ $t('failedToFindPage') }}
        </h2>
        </p>
        <p class="mt-7">
            <v-btn @click="$router.back()">
                {{ $t('Back') }}
            </v-btn>
        </p>
    </div>
</template>