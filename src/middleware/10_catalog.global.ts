export default defineNuxtRouteMiddleware((to, from) => {
    useCatalogStore().loadCatalog();
})
