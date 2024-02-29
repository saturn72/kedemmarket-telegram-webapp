import { getOrderById } from "@/services/order";
import { getCatalog } from "~/services/catalog";
import { io, type Socket } from "socket.io-client";

const maxRetries = 5;
let socket: Socket;
let timoutTimer: NodeJS.Timeout;

// const connectToSignalR = async (
//     url: string,
//     useAccessToken: boolean,
//     hubConnectionConfig: (con: HubConnection) => void,
//     retryCount: number = 0): Promise<void> => {
//     try {
//         const connection = new signalR.HubConnectionBuilder();
//         let u = connection.withUrl(url);
//         if (useAccessToken) {
//             const accessToken = await useUserStore().user.accessToken;
//             u = connection.withUrl(url, { accessTokenFactory: () => accessToken });
//         }
//         const c = u.withAutomaticReconnect()
//             .build();

//         hubConnectionConfig(c);
//         await c.start();
//     }
//     catch (err: any) {
//         if (retryCount++ < maxRetries) {
//             const delay = Math.pow(2, retryCount);
//             console.error(`Failed to connect to \'${url}\', retrying in ${delay}. number of retries: ${retryCount}, total retries allowed: ${maxRetries}`);
//             setTimeout(() => connectToSignalR(url, useAccessToken, hubConnectionConfig, retryCount),
//                 delay * 1000);
//         } else {
//             console.error(err)
//         }
//     }
// }

const subscribeToNotifications = () => {
    let retryCount: number = 1;
    const tryConnect = () => {
        console.log(`start ws connection - socketio connection attempt #${retryCount}`);
        socket?.disconnect();

        socket = io(useRuntimeConfig().public.bffUrl, { path: '/notify' });
        socket?.connect();
    };

    tryConnect();
    socket.on('connect_error', (error) => {
        console.log("error:", error);
        if (retryCount++ <= maxRetries && !socket.active) {
            const delay = Math.pow(2, retryCount);
            timoutTimer = setTimeout(tryConnect, delay * 1000);
        } else {
            console.error(error)
        }
    });

    socket.on('connect', function () {
        console.log('Connected to wss');
    });

    socket.on("catalog:updated", () => {
        console.log("catalog:updated");
        // useNuxtApp().$cache.removeByPrefix("catalog");
        // await getCatalog();
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
        clearTimeout(timoutTimer)
        unsubsribeFromNotifications();
    };
})