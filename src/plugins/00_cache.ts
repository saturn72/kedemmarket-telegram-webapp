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

export default defineNuxtPlugin((nuxtApp) => {
    return {
        provide: {
            cache: {

                remove: (key: string): void => {
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
                    const k = key.replaceAll(' ', '-').toLowerCase();

                    var item = getItemFromLocalStorage<T>(k);
                    if (item) {
                        return item;
                    }

                    const av = await acquire();
                    if (av) {
                        const entry: CacheEntry =
                        {
                            data: av,
                            expiration: moment.utc().add(expiration, 'seconds')
                        }
                        localStorage.setItem(k, JSON.stringify(entry))
                        return av;
                    }
                    return null;
                }
            }
        }
    }
});