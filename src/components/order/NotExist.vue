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
                        {{ $t('failedToLocateOrder') }}
                    </h2>
                    </p>
                    <p class="mt-7">
                        <v-row>
                            <v-progress-linear indeterminate></v-progress-linear>
                        </v-row>
                        <v-row class="justify-center">
                            {{ $t('browsingToOrders') }}
                        </v-row>
                    </p>
                </div>
            </v-col>
        </v-card>
    </v-dialog>
</template>

<script>
let timoutTimer = undefined;

export default {
    setup() {
        onBeforeUnmount(() => {
            if (timoutTimer) {
                clearTimeout(timoutTimer);
            }
        });
    },
    props: {
        show: { type: Boolean },
    },
    mounted() {
        timoutTimer = setTimeout(() => this.$router.back(), 5000)
    }
}
</script>