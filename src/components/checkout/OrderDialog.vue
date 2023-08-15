<template>
    <v-dialog persistent class="text-center" :model-value="show">
        <v-card height="80%">
            <v-card-title>{{ $t('placingOrder') }}</v-card-title>
            <v-col class="d-flex justify-center">
                <v-progress-circular indeterminate :size="75" :width="5"></v-progress-circular>
            </v-col>
        </v-card>
    </v-dialog>
</template>

<script>

export default {
    props: {
        show: { type: Boolean },
        order: { type: Object }
    }
}
</script>