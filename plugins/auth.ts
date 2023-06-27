import {useUser} from "../composables/useUser";

export default defineNuxtPlugin((ctx: any) => {
  if (ctx.payload.error) {
    return {};
  }

  const {fetchUser, fetchToken} = useUser()
  fetchToken().then(() => fetchUser()).catch(() => console.log('error'));

  return {}
})
