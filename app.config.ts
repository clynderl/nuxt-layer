export default defineAppConfig({
  myLayer: {
    name: 'Hello from Nuxt layer CHANGED'
  }
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    myLayer?: {
      /** Project name */
      name?: string
    }
  }
}
