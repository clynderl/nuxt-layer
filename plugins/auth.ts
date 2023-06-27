export default defineNuxtPlugin(async (ctx: any) => {
  if (ctx.payload.error) {
    return {};
  }

  // const {fetchUser, fetchToken} = useUser()
  // await fetchToken();
  // await fetchUser();
  // return {}
})
