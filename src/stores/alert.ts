import _ from "lodash";
import { defineStore } from 'pinia'

type AlertType = "dialog" | "loader" | "snackbar";

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

async function waitForCondition(condition: () => boolean, ms: number = 250) {
    return await new Promise(resolve => {
        const interval = setInterval(() => {
            if (!condition()) {
                clearInterval(interval);
                resolve(true);
            };
        }, ms);
    });
}


export const useAlertStore = defineStore('alert', {
    state: (): AlertState => {
        return initValue;
    },
    actions: {
        clearAlarms() {
            this.$state.alertTimelines = {};
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
        setAppLoader(): void {
            this.$state.type = "loader";
        },
        async setAppLoaderByCondition(condition: () => boolean): Promise<void> {
            this.$state.type = "loader";
            await waitForCondition(condition);
            this.$state.type = undefined;
        },
        setDialog(data: any) {
            this.$state.type = "dialog";
            this.$state.data = _.cloneDeep(data);
        },
        setSnackbar(
            text: string,
            {
                duration = 5000,
                timeBetweenAlerts = 5000,
                force = false
            }: {
                duration?: number,
                timeBetweenAlerts?: number,
                force?: boolean,
            }) {
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