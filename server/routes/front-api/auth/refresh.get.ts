import {useRuntimeConfig} from "#imports";
import {joinURL} from 'ufo'

const {backendBaseUrl} = useRuntimeConfig();
export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'refreshToken');
  if (!token) {
    return createError({
      statusCode: 400,
      message: 'Token expired',
    });
  }
  const endpoint = '/api/v1/token/refresh/';
  const url = joinURL(backendBaseUrl as string, endpoint);
  const tokenName = 'refresh';
  try {
    const result = (await $fetch(url, {
      method: 'POST',
      body: {[tokenName]: token},
    })) as any;
    return result.access;
  } catch (e) {
    deleteCookie(event, 'refreshToken');

    return createError({
      statusCode: 400,
      message: 'Token invalid',
    });
  }
});
