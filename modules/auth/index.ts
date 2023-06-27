import {addPlugin, createResolver, defineNuxtModule} from "nuxt/kit";


export default defineNuxtModule({
  meta: {
    name: 'auth',
    configKey: 'auth',
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    addPlugin(resolve('./runtime/plugin'));
  }
});
