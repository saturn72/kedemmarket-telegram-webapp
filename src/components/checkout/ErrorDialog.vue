<template>
    <v-dialog persistent class="text-center" :model-value="show">
        <v-card height="80%">
            <v-col class="d-flex justify-center">
                <div class="mt-7 max-w-sm mx-auto text-center card">
                    <p class="mt-7 text-6xl font-bold">
                    <h1>{{ $t('ooops') }}</h1>
                    </p>
                    <p class="mt-7">
                    <h2>
                        {{ $t('failedToPerformAction') }}
                    </h2>
                    </p>
                    <v-row>
                        <v-col>
                            <v-btn @click="$emit('retry')">
                                {{ $t('retry') }}
                            </v-btn>
                        </v-col>
                        <v-col>
                            <AppBackToStoreButton />
                        </v-col>
                    </v-row>
                </div>
            </v-col>
        </v-card>
    </v-dialog>
</template>

<script>

export default {
    props: {
        show: { type: Boolean },
    }
}
</script>