import {joinURL} from "ufo";

const {backendBaseUrl} = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email: string; password: string }>(event);
  if (!body) {
    return createError({
      statusCode: 400,
      message: 'Email address and password are required',
    });
  }
  const {email, password} = body;

  if (!email || !password) {
    const errors = {
      email: !email ? 'Это поле обязательно' : '',
      password: !password ? 'Это поле обязательно' : '',
    };
    return createError({
      statusCode: 400,
      message: 'Email address and password are required',
      data: errors,
    });
  }
  const endpoint = '/api/v1/token/';
  const url = joinURL(backendBaseUrl as string, endpoint);
  const result = (await $fetch(url, {
    method: 'POST',
    body: {email, password},
  })) as any;
  const {accessName, refreshName, refreshMaxAge} = {
    accessName: 'access',
    refreshName: 'refresh',
    refreshMaxAge: 24 * 60 * 60
  }
  if (!result[accessName] || !result[refreshName]) {
    return createError({
      statusCode: 400,
      message: 'Invalid email or password',
    });
  }

  setCookie(event, 'refreshToken', result[refreshName], {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    // expires: rememberMe
    //   ? new Date(Date.now() + config.cookieRememberMeExpires)
    //   : new Date(Date.now() + config.cookieExpires),
    maxAge: refreshMaxAge,
  });

  return {
    access: result.access,
  };
});

