import { defineStore } from 'pinia'

type AlertType = "snackbar";

type AlertState = {
    type?: AlertType | undefined,
    text?: string | undefined;
    action?: { text: string, func: () => any } | undefined,
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
            options: {
                duration: number,
                timeBetweenAlerts: number,
                action?: { text: string, func: () => any } | undefined
            } = {
                    duration: 5000,
                    timeBetweenAlerts: 30 * 60 * 60 * 1000,
                }) {


            if (type == undefined) {
                this.$state.type = undefined;
                this.$state.text = undefined;
            }

            const t = type as AlertType;
            const cur = Date.now();
            const a = this.$state.alertTimelines[t];

            if (a && cur - a < options.timeBetweenAlerts) {
                this.$state.type == undefined;
                return;
            }

            this.$state.type = type;
            this.$state.text = text;
            this.$state.action = options.action;
            this.$state.duration = options.duration;
            this.$state.action = options.action;
            this.$state.alertTimelines[t] = cur;

            setTimeout(() => {
                this.$state.type = undefined;
                this.$state.text = undefined;
            }, options.duration)
        }
    },
    persist: {
        storage: persistedState.localStorage
    }
});