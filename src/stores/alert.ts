import _ from "lodash";
import { defineStore } from 'pinia'

type AlertType = "snackbar" | "dialog";

type AlertState = {
    alertTimelines: [key: AlertType, item: number] | any
    data?: any,
    duration?: number,
    text?: string | undefined;
    type?: AlertType | undefined,
}

const initValue = {
    alertTimelines: {}
};

export const useAlertStore = defineStore('alert', {
    state: (): AlertState => {
        return initValue;
    },
    getters: {
        getType: (state): AlertType | undefined => {
            return state.type;
        },

        getData: (state): any => {
            return state.data;
        },
    },
    actions: {
        clearAlarms() {
            this.$state.alertTimelines = undefined;
            this.$state.duration = undefined;
            this.$state.data = undefined;
            this.$state.text = undefined;
            this.$state.type = undefined;
        },
        clearAlarmType(type: AlertType) {
            if (this.$state.type == type) {
                this.clearAlarms()
            }
        },
        setDialog(data: any) {
            this.$state.type = "dialog";
            this.$state.data = _.cloneDeep(data);
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

            this.$state.alertTimelines[type] = cur;
            this.$state.duration = duration;
            this.$state.text = text;
            this.$state.type = type;

            if (duration > 0) {
                setTimeout(() => {
                    this.clearAlarmType("snackbar");
                }, duration)
            }
        }
    },
    persist: {
        storage: persistedState.sessionStorage
    }
});