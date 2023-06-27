import {useUser} from "./useUser";

const signIn = async (credentials: any, callback?: any | undefined) => {
  const {data, error} = await useFetch(`/front-api/auth/login`, {
    method: 'POST',
    body: credentials
  });
  if (error.value) {
    throw error.value.data;
  }
  if (callback !== undefined) {
    callback(data.value);
    return;
  }
  window.location.replace('/account/orders');
}

const logOut = async () => {
  const {data, error} = await useFetch(`/front-api/auth/logout`, {
    method: 'POST',
  });
  if (error.value) {
    throw error.value.data;
  }
  if (data.value) {
    window.location.replace('/');
  }
}

export function useAuth() {
  const {accessToken} = useUser()
  const {backendBaseUrl} = useRuntimeConfig().public;

  const fetcher = $fetch.create({
    baseURL: backendBaseUrl,
    onRequest({options}): Promise<void> | void {
      const {accessToken} = useUser();
      if (accessToken.value) {
        // eslint-disable-next-line no-param-reassign
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${accessToken.value}`,
        };
      }
    },
    async onResponse({response}): Promise<void> {
      if (response.status === 401) {
        try {
          const access = await $fetch('/front-api/auth/refresh');
          // set access token to store
          accessToken.value = access;
        } catch (error: any) {
          if (error.response?.status === 400) {
            // userStore.setAccessToken(null);
            // userStore.setUser(null);
            window.location.replace('/');
          }
        }
      }
    },
  });

  const fetch = async (
    request,
    options = {},
    // eslint-disable-next-line consistent-return
  ) => {
    try {
      const response = await fetcher(request, options);
      return response;
    } catch (error: any) {
      if (error.response?.status === 401) {
        const response = await fetcher(request, options);
        return response;
      }
      throw error.response;
    }
  };


  return {
    signIn,
    logOut,
    fetch,
  }
}
