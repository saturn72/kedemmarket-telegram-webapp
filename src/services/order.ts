import { Order } from "models/cart";
import { useUserStore } from "@/stores/user";

const expiration = 10 * 60;

type Pagination = {
    pageSize: number,
    skip: number
};

export function getOrdersCacheKeyPrefix() {
    const userId = useUserStore().getUser.uid;
    return `orders:${userId}`.toLocaleLowerCase();
}

export async function getOrders(options: Pagination = {
    pageSize: 10,
    skip: 0
}): Promise<Order[] | null | undefined> {
    const key = `${getOrdersCacheKeyPrefix()}_pagesize:${options.pageSize}_skip:${options.skip}`;

    return await useNuxtApp().$cache.getOrAcquire(key,
        async () => await useNuxtApp().$backend.getOrders(options),
        expiration);
}

export async function getOrderById(orderId: any): Promise<Order | null | undefined> {
    const key = `${getOrdersCacheKeyPrefix()}_orderid:${orderId}`;
    return await useNuxtApp().$cache.getOrAcquire(key,
        async () => await useNuxtApp().$backend.getOrderById({ orderId }),
        expiration);
}