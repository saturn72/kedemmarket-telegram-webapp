

async function waitForUser() {
    return await new Promise(resolve => {
        const interval = setInterval(() => {
            if (useUserStore().getUser != undefined) {
                clearInterval(interval);
                resolve(true);
            };
        }, 250);
    });
}

export default defineNuxtRouteMiddleware(async () => {
    useAlertStore().setAppLoader();
    await waitForUser();
    useAlertStore().$state.type = undefined;
});