import {useUser} from "../composables/useUser";

export default defineNuxtPlugin((ctx: any) => {
  if (ctx.payload.error) {
    return {};
  }

  const {fetchUser, fetchToken} = useUser()
  fetchToken();
  fetchUser();
  return {}
})
