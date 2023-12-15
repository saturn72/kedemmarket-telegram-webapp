<template>
    <v-snackbar v-model="show" :timeout="timeout" transition="fade-transition">
        <v-row>
            <v-col>
                {{ text }}
                <v-btn v-if="action" variant="text" @click="action.func" color="secondary">
                    {{ action.text }} </v-btn>
            </v-col>
        </v-row>
        <template v-slot:actions>
            <v-btn variant="text" @click="close" icon>
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
                this.action = state.action;
            }
        });
    },
    methods: {
        close() {
            useAlertStore().clearAlarms();
        }
    },
    data() {
        return {
            show: false,
            text: undefined,
            action: undefined,
            timeout: undefined
        }
    }

}
</script>