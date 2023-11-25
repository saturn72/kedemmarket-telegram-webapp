import * as signalR from "@microsoft/signalr";
import { getCatalog } from "@/services/catalog";
import { HubConnection } from "@microsoft/signalr";
import { useUserStore } from "@/stores/user";
import { getOrderById } from "@/services/order";

const delay = 5000;
const maxRetries = 10;

const connectToSignalR = async (
    url: string,
    useAccessToken: boolean,
    hubConnectionConfig: (con: HubConnection) => void,
    retryCount: number = 0): Promise<void> => {
    try {
        const connection = new signalR.HubConnectionBuilder();
        let u = connection.withUrl(url);
        if (useAccessToken) {
            const accessToken = await useUserStore().user.accessToken;
            u = connection.withUrl(url, { accessTokenFactory: () => accessToken });
        }
        const c = u.withAutomaticReconnect()
            .build();

        hubConnectionConfig(c);
        await c.start();
    }
    catch (err: any) {
        // if (retryCount++ < maxRetries) {
        //     console.error(`Failed to connect to \'${url}\', retrying in ${delay}. number of retries: ${retryCount}, total retries allowed: ${maxRetries}`);
        //     setTimeout(() => connectToSignalR(url, useAccessToken, hubConnectionConfig, retryCount),
        //         delay);
        // } else {
        //     console.error(err)
        // }
    }
}

export default defineNuxtPlugin(async (nuxtApp) => {
    connectToSignalR(`${useRuntimeConfig().public.wsURL}catalog`, false, hcc => {
        hcc.on("updated", async () => {
            useNuxtApp().$sessionCache.removeByPrefix("catalog");
            await getCatalog();
        });

    });
    connectToSignalR(`${useRuntimeConfig().public.wsURL}order`, true, hcc => {
        hcc.on("updated", async (orderId: string) => {
            await getOrderById(orderId, true);
        });
    });

    return {
    }
});

