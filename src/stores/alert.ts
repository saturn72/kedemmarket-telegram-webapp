import { defineStore } from 'pinia'

type AlertType = "snackbar" | "overlay";

type AlertState = {
    type?: AlertType | undefined,
    text?: string | undefined;
    duration?: number,
    alertTimelines: [key: AlertType, item: number] | any
}

export const useAlertStore = defineStore('alert', {
    state: (): AlertState => {
        return {
            alertTimelines: {}
        };
    },

    actions: {
        clearAlarms() {
            this.$state.type = undefined;
            this.$state.text = undefined;
        },
        setSnackbar(
            text: string,
            duration: number = 5000,
            timeBetweenAlerts: number = 5000,
            force: boolean = false) {

            const type = "snackbar";
            const cur = Date.now();
            const a = this.$state.alertTimelines[type];

            if (!force && a && cur - a < timeBetweenAlerts) {
                this.$state.type == undefined;
                return;
            }

            this.$state.type = type;
            this.$state.text = text;
            this.$state.duration = duration;
            this.$state.alertTimelines[type] = cur;

            setTimeout(() => {
                this.clearAlarms();
            }, duration)
        }
    },
    persist: {
        storage: persistedState.localStorage
    }
});