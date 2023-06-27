export function useUser() {
  const user = useState('user', () => null);
  const accessToken = useState('accessToken', () => null);
  const apiPath = 'front-api'
  const {backendBaseUrl} = useRuntimeConfig().public;

  const fetchToken = async () => {
    const {data, error} = await useFetch(`/${apiPath}/auth/refresh`);
    if (error.value) {
      throw error.value.data;
    }
    if (data.value) {
      accessToken.value = data.value;
    }
  }

  const fetchUser = async () => {
    if (!accessToken.value) {
      return;
    }
    const {data, error} = await useFetch(`${backendBaseUrl}/api/v1/users/me/`, {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      }
    });
    console.log(data.value)
    if (error.value) {
      throw error.value.data;
    }
    if (data.value) {
      user.value = data.value;
    }
  }

  return {
    user,
    accessToken,
    fetchUser,
    fetchToken,
  }
}
