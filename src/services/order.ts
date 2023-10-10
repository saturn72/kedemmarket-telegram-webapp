import { Order } from "models/cart";
import { useUserStore } from "@/stores/user";

function getOrdersCacheKeyPrefixInternal(): string {
    const userId = useUserStore().getUser.uid;
    return `orders:${userId}`.toLocaleLowerCase();
}

function getOrdersCacheKeyInternal(pageSize: number, skip: number): string {
    return `${getOrdersCacheKeyPrefixInternal()}_pagesize:${pageSize}_skip:${skip}`;
}

type Pagination = {
    pageSize: number,
    skip: number
};

async function getOrdersInternal(options: Pagination) {
    const key = getOrdersCacheKeyInternal(options.pageSize, options.skip);

    return await useNuxtApp().$cache.getOrAcquire(key,
        async () => await useNuxtApp().$backend.getOrders(),
        10 * 60);
}

export function getOrdersCacheKeyPrefix() {
    return getOrdersCacheKeyPrefixInternal();
}

export function getOrdersCacheKey(pageSize: number = 10, skip: number = 0): string {
    return getOrdersCacheKeyInternal(pageSize, skip);
}

export async function getOrders(options: Pagination = {
    pageSize: 10,
    skip: 0
}): Promise<Order[] | null | undefined> {
    return getOrdersInternal(options)
}

export async function getOrderById(orderId: any): Promise<Order | null> {
    const pageSize = 10;
    let skip = 0;
    let res = undefined;
    let orders: Order[] | undefined | null;

    do {
        orders = await getOrdersInternal({ pageSize, skip });
        const o = orders?.find((o: Order) => o.orderId == orderId);
        if (o) {
            return o;
        }
        skip += pageSize;
    }
    while (orders && orders.length == pageSize)

    return null;
}