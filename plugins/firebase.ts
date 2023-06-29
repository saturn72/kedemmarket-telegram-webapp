import { FirebaseApp, initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

let app: FirebaseApp;

export default defineNuxtPlugin((nuxtApp) => {
    app = initializeApp(useAppConfig().firebase);
    return {
        provide: {
            storage: {
                getDownloadUrl: async (uri: string): Promise<String> => {
                    const storageRef = ref(getStorage(app), uri);
                    return await getDownloadURL(storageRef);
                }
            }
        }
    }
});