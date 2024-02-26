import _ from "lodash";
import type { UseFetchOptions } from "nuxt/app"
import pRetry from 'p-retry';

async function makeHttpCall<ResT = void>(url: string, opts?: UseFetchOptions<ResT>): Promise<ResT> {
    const appToken = await useNuxtApp().$backend.getAppToken();
    const o: UseFetchOptions<ResT> = {
        method: "GET",
        ...opts,
        headers: {
            ...opts?.headers,
            'X-Firebase-AppCheck': appToken
        }
    };

    let d: any = {};
    const run = async () => {
        const { data, error } = await useFetch(url, o);

        if (error.value) {
            console.debug(`Failed to fetch data from url: ${url} using options: ${JSON.stringify(o)}`);
            throw new Error(error.value?.message);
        }

        d = _.cloneDeep(toRaw(data.value));
    };

    await pRetry(run, {
        maxRetryTime: 20000,
        retries: 5,
        randomize: true,
        maxTimeout: 1000,
        minTimeout: 50,
        onFailedAttempt: e => {
            console.error(`Failed to access backend.Attempt ${e.attemptNumber} of  ${e.attemptNumber + e.retriesLeft}`);
        },
    });

    return d
}

export async function useBffFetch<ResT = void>(uri: string, opts?: UseFetchOptions<ResT>): Promise<ResT | undefined> {
    const url = `${useRuntimeConfig().public.bffUrl}${uri}`;
    return await makeHttpCall<ResT>(url, opts);
}

export async function useBffNotifications<ResT = void>(
    uri: string,
    opts?: UseFetchOptions<ResT>): Promise<EventSource> {

    const url = `${useRuntimeConfig().public.bffUrl}${uri}`;
    makeHttpCall<ResT>(url, opts);

    const appToken = await useNuxtApp().$backend.getAppToken();
    const o = {
        headers: {
            'X-Firebase-AppCheck': appToken
        }
    };
    const eventSource = new EventSource(url, { withCredentials: true });

    eventSource.onerror = (ev: Event) => {
        console.log(`Error in event source \'${url}\': \'${JSON.stringify(ev)}\'`);
        console.log(`Closing event source: \'${url}\;`);
        eventSource.close();
        console.log(`Event source closed: \'${url}\;`);
    };
    return eventSource;
}

export async function useBackendFetch<ResT = void>(uri: string, opts?: UseFetchOptions<ResT>)
    : Promise<ResT> {
    const url = `${useRuntimeConfig().public.backendUrl}${uri}`;
    return makeHttpCall<ResT>(url, opts);
}