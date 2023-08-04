<template>
    <v-snackbar v-model="show" :timeout="timeout">
        {{ text }}
        <template v-slot:actions>
            <v-btn color="red" variant="text" @click="close" icon>
                <v-icon>mdi-close-circle-outline</v-icon>
                <!-- {{ $t("close") }} -->
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script >
import { useAlertStore } from '@/stores/alert';

export default {
    created() {
        const store = useAlertStore();
        store.$subscribe((mutation, state) => {
            this.show = state.type == "snackbar";

            if (this.show) {
                this.text = state.text;
                this.timeout = state.duration;
            }
        });
    },
    methods: {
        close() {
            useAlertStore().setAlarm(undefined, undefined);
        }
    },
    data() {
        return {
            show: false,
            text: undefined,
            timeout: undefined
        }
    }

}
</script>