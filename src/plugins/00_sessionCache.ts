import moment from "moment";

type CacheEntry = { data: any, expiration: moment.Moment };
const getItemFromSessionStorage = <T>(key: any): T | undefined => {
    const value = sessionStorage.getItem(key);
    if (!value) {
        return undefined;
    }

    const entry = JSON.parse(value) as CacheEntry;
    if (!entry || moment.utc().isAfter(entry.expiration)) {
        sessionStorage.removeItem(key);
        return undefined;
    }

    return entry.data as T;
}

const prepareCacheKey = (key: string): string => `km-${key.replaceAll(' ', '-').toLowerCase()}`;

const setItemInternal = <T>(key: string,
    data: T,
    expiration: number): void => {
    const k = prepareCacheKey(key);
    const entry: CacheEntry =
    {
        data: data,
        expiration: moment.utc().add(expiration, 'seconds')
    }
    sessionStorage.setItem(k, JSON.stringify(entry))
}

export default defineNuxtPlugin((nuxtApp) => {
    return {
        provide: {
            sessionCache: {
                set: async<T>(key: string,
                    data: T,
                    expiration: number): Promise<void> => {

                    if (data) {
                        setItemInternal<T>(key, data, expiration);
                    }
                },
                remove: async (key: string): Promise<void> => {
                    sessionStorage.removeItem(key)
                },

                removeByPrefix: (prefix: string): void => {
                    const keysToRemove: string[] = [];
                    for (let i = 0; i < sessionStorage.length; i++) {
                        const key = sessionStorage.key(i);

                        if (key?.startsWith(prefix)) {
                            keysToRemove.push(key);
                        }
                    }

                    for (let i = 0; i < keysToRemove.length; i++) {
                        sessionStorage.removeItem(keysToRemove[i]);
                    }
                },

                get: async <T>(key: string): Promise<T | undefined | null> => getItemFromSessionStorage<T>(key),

                getOrAcquire: async<T>(key: string,
                    acquire: () => Promise<T>,
                    expiration: number): Promise<T | undefined | null> => {
                    const k = prepareCacheKey(key);

                    var item = getItemFromSessionStorage<T>(k);
                    if (item) {
                        return item;
                    }

                    const av = await acquire();
                    if (av) {
                        setItemInternal<T>(key, av, expiration);
                        return av;
                    }
                    return null;
                }
            }
        }
    }
});