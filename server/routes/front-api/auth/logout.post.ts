export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'refreshToken');
  if (!token) {
    return createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }
  deleteCookie(event, 'refreshToken');
  return { success: true };
});
