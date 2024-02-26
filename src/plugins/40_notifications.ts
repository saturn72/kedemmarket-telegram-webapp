import * as signalR from "@microsoft/signalr";
import { HubConnection } from "@microsoft/signalr";
import { useUserStore } from "@/stores/user";
import { getOrderById } from "@/services/order";
import { getCatalog } from "~/services/catalog";
import { io, type Socket } from "socket.io-client";
import { useBffFetch } from "~/services/backend";

const maxRetries = 5;
let socket: Socket;

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
        if (retryCount++ < maxRetries) {
            const delay = Math.pow(2, retryCount);
            console.error(`Failed to connect to \'${url}\', retrying in ${delay}. number of retries: ${retryCount}, total retries allowed: ${maxRetries}`);
            setTimeout(() => connectToSignalR(url, useAccessToken, hubConnectionConfig, retryCount),
                delay * 1000);
        } else {
            console.error(err)
        }
    }
}

const subscribeToNotifications = () => {
    console.log("start ws connection")
    socket = io(useRuntimeConfig().public.bffUrl);

    socket.on('connect_error', (e) => console.log("error:", e));

    socket.on('connect', function () {
        console.log('Connected to wss');
    });

    socket.on("catalog:updated", async () => {
        console.log("catalog:updated");
        useNuxtApp().$cache.removeByPrefix("catalog");
        await getCatalog();
    });

    socket.on("order:updated", async ({ orderId }) => {
        console.log("order:updated");
        await getOrderById(orderId, true);
    });
}

const unsubsribeFromNotifications = () => {
    socket.disconnect();
    window.onbeforeunload = null;
    console.log("wss connection closed");
};

export default defineNuxtPlugin(async (nuxtApp) => {
    subscribeToNotifications();

    window.onbeforeunload = (e) => {
        unsubsribeFromNotifications();
    };

    // connectToSignalR(`${useRuntimeConfig().public.wsUrl}catalog`,
    //     false, hcc => {
    //         hcc.on("updated", async () => {
    //             useNuxtApp().$cache.removeByPrefix("catalog");
    //             await getCatalog();
    //         });
    //     });

    // connectToSignalR(`${useRuntimeConfig().public.wsUrl}order`,
    //     true, hcc => {
    //         hcc.on("updated", async (orderId: string) => {
    //             await getOrderById(orderId, true);
    //         });
    //     });
})