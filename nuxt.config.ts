// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
  modules: ['@nuxt/ui', '@nuxtjs/color-mode',],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL
    },
  },
  vite: {
    optimizeDeps: {
      exclude: ['axios', 'form-data'],
    },
    ssr: {
      noExternal: ['form-data'],
    },
  },
})