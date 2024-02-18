if (process.env.NODE_ENV != 'production') {
    console.debug("adding debug behavior")
    //to enable application debugging
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}
export default defineNuxtPlugin((nuxtApp) => {
});