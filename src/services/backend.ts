import _ from "lodash";
import type { UseFetchOptions } from "nuxt/app"
import pRetry from 'p-retry';

export async function useBackendFetch<ResT = void>(uri: string, opts: UseFetchOptions<ResT>): Promise<any> {

    let d: any = {};
    const run = async () => {
        const { data, error } = await useFetch(uri, {
            baseURL: useRuntimeConfig().public.baseURL,
            ...opts,
        });

        if (error.value) {
            throw new Error(error.value?.message)
        }

        d = _.cloneDeep(toRaw(data.value));
    };

    try {
        await pRetry(run, {
            maxRetryTime: 20000,
            retries: 5,
            randomize: true,
            maxTimeout: 1000,
            minTimeout: 50,
            onFailedAttempt: e => {
                console.log(`Failed to access backend. Attempt ${e.attemptNumber} of  ${e.attemptNumber + e.retriesLeft}`);
            },
        });
    } catch (err) {
        return { error: err };
    }

    return {
        data: d
    };

}