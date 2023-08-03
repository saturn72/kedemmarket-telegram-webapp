import { defineStore } from 'pinia'

type AlertType = "snackbar";

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
        setAlarm(
            type: AlertType | undefined,
            text: string,
            duration: number = 5000,
            timeBetweenAlerts: number = 30 * 60 * 60 * 1000) {

            if (type == undefined) {
                this.$state.type = undefined;
                this.$state.text = undefined;
            }

            const t = type as AlertType;

            const cur = Date.now();
            const a = this.$state.alertTimelines[t];

            if (a && cur - a < timeBetweenAlerts) {
                this.$state.type == undefined;
                return;
            }

            this.$state.type = type;
            this.$state.text = text;
            this.$state.duration = duration;
            this.$state.alertTimelines[t] = cur;

            setTimeout(() => {
                this.$state.type = undefined;
                this.$state.text = undefined;
            }, duration)
        }
    }
});