// https://v3.nuxtjs.org/api/configuration/nuxt.config
import {createResolver} from "@nuxt/kit";

const { resolve } = createResolver(import.meta.url)
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    resolve('./modules/auth'),
  ],

  pinia: {
    autoImports: [
      'defineStore', ['defineStore', 'definePiniaStore'],
    ],
  },
})
