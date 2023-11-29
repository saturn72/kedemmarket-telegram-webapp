import type { Order } from "@/models/cart";
import { useUserStore } from "@/stores/user";

const expiration = 10 * 60;

type Pagination = {
    pageSize: number,
    skip: number
};

const cache = () => useNuxtApp().$sessionCache;

export function getOrdersCacheKeyPrefix() {
    const userId = useUserStore().getUser.uid;
    return `orders:${userId}`.toLocaleLowerCase();
}

export function clearOrderCache() {
    cache().removeByPrefix(getOrdersCacheKeyPrefix());
}

export async function getOrders(options: Pagination = {
    pageSize: 10,
    skip: 0
}, status: string[]): Promise<Order[] | null | undefined> {
    const s = status ? `_status:${status.toString().toLowerCase()}` : '';
    const key = `${getOrdersCacheKeyPrefix()}_pagesize:${options.pageSize}_skip:${options.skip}${s}`;

    return await cache().getOrAcquire(key,
        async () => await useNuxtApp().$backend.getOrders(options, status),
        expiration);
}

export async function getOrderById(orderId: string, force: boolean = false): Promise<Order | null | undefined> {
    const key = `${getOrdersCacheKeyPrefix()}_orderid:${orderId}`;
    const sc = cache();

    if (force) {
        sc.remove(key);
    }

    return await sc.getOrAcquire(key,
        async () => await useNuxtApp().$backend.getOrderById(orderId),
        expiration);
}