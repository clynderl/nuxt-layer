// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    '@pinia/nuxt',
  ],

  pinia: {
    autoImports: [
      'defineStore', ['defineStore', 'definePiniaStore'],
    ],
  },
})
