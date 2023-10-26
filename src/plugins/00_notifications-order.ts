import * as signalR from "@microsoft/signalr";
import { useUserStore } from "@/stores/user";
import { getOrderById } from '@/services/order';

export default defineNuxtPlugin(async (nuxtApp) => {

    const url = `${useRuntimeConfig().public.wsURL}order`
    const accessToken = await useUserStore().user.accessToken;
    const connection = new signalR.HubConnectionBuilder()
        .withUrl(url, { accessTokenFactory: () => accessToken })
        .withAutomaticReconnect()
        .build();

    connection.on("updated", async (orderId: string) => {
        await getOrderById(orderId, true);
    });

    await connection.start();

    return {
    }
});