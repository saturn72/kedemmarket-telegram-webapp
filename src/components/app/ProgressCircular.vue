<template>
    <div class="d-flex justify-center">
        <v-row>
            <v-col>
                <v-progress-circular indeterminate :size="75" :width="5"></v-progress-circular>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                {{ $t(text) }}
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    props: {
        text: { type: String, default: "loading" },
    }
}
</script>