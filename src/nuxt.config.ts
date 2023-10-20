// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  app: {
    head: {
      titleTemplate: '%s - kedemmarket-cart',
      title: 'kedemmarket-cart',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      baseURL: process.env.BACKEND_URL || 'https://kedemmarket.co.il/api/',
      wsURL: process.env.WS_URL || 'https://kedemmarket.co.il/ws/',
    },
  },
  components: [
    {
      path: '~/components',
      extensions: ['.vue'],
    }
  ],
  modules: [
    // '@nuxtjs/i18n',
    '@invictus.codes/nuxt-vuetify',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
  ],
  vuetify: {
    vuetifyOptions: {
      locale: {
        locale: 'he',
        fallback: 'he'
      }
    }
  }
})
