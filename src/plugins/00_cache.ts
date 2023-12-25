import moment from "moment";

type CacheEntry = { data: any, expiration: moment.Moment };
const getItemFromLocalStorage = <T>(key: any): T | undefined => {
    const value = localStorage.getItem(key);
    if (!value) {
        return undefined;
    }

    const entry = JSON.parse(value) as CacheEntry;
    if (!entry || moment.utc().isAfter(entry.expiration)) {
        localStorage.removeItem(key);
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
    localStorage.setItem(k, JSON.stringify(entry))
}

export default defineNuxtPlugin((nuxtApp) => {
    return {
        provide: {
            cache: {
                set: async<T>(key: string,
                    data: T,
                    expiration: number): Promise<void> => {

                    if (data) {
                        setItemInternal<T>(key, data, expiration);
                    }
                },
                remove: async (key: string): Promise<void> => {
                    localStorage.removeItem(key)
                },

                removeByPrefix: (prefix: string): void => {
                    const keysToRemove: string[] = [];
                    for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);

                        if (key?.startsWith(prefix)) {
                            keysToRemove.push(key);
                        }
                    }

                    for (let i = 0; i < keysToRemove.length; i++) {
                        localStorage.removeItem(keysToRemove[i]);
                    }
                },

                get: async <T>(key: string): Promise<T | undefined | null> => getItemFromLocalStorage<T>(key),

                getOrAcquire: async<T>(key: string,
                    acquire: () => Promise<T>,
                    expiration: number): Promise<T | undefined | null> => {
                    const k = prepareCacheKey(key);

                    var item = getItemFromLocalStorage<T>(k);
                    if (item) {
                        return item;
                    }

                    const av = await acquire();
                    if (av) {
                        setItemInternal<T>(key, av, expiration);
                    }
                    return av;
                    // return null;
                }
            }
        }
    }
});