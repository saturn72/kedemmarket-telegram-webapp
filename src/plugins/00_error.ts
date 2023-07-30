export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.config.errorHandler = (error, context) => {


        console.log("this is error page");
        console.log(error);
        console.log(context);
    }
})
