<template>
    <v-snackbar v-model="show" :timeout="timeout">
        <v-row>
            <v-col>
                {{ text }}
                <v-btn v-if="action" variant="text" @click="action.func" color="secondary">
                    {{ action.text }} </v-btn>
            </v-col>
        </v-row>
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
        console.log("on subscribe");
        store.$subscribe((mutation, state) => {
            this.show = state.type == "snackbar";
            console.log("in snackbar here", state.type, this.show);

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