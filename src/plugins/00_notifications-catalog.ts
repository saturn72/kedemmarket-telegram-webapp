import * as signalR from "@microsoft/signalr";
import { useCatalogStore } from "@/stores/catalog";

export default defineNuxtPlugin(async (nuxtApp) => {
    const url = `${useRuntimeConfig().public.wsURL}catalog`

    try {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(url)
            .withAutomaticReconnect()
            .build();

        connection.on("updated", async () => {
            useNuxtApp().$sessionCache.removeByPrefix("catalog");
            await useCatalogStore().loadCatalog();
        });

        await connection.start();
    }
    catch { }
    return {

    }
});