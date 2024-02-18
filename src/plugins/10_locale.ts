import en from "~/locales/en-US";
import he from "~/locales/he-IL";
import type { Locale } from "~/locales/types";

const hed = he as Locale
const end = en as Locale

export default defineNuxtPlugin((nuxtApp) => {
    return {
        provide: {
            t: (key: string): string => {
                return hed[key] || end[key] || key;
            }
        }
    }
});