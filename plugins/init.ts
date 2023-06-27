import useExchange from "../composables/useExchange";

export default defineNuxtPlugin(async (ctx: any) => {
  // if (nuxtApp.payload.error) {
  //   return {};
  // }
  console.log('init', ctx)
  const {fetchDirections, fetchReserves} = useExchange();

  await fetchDirections();
  await fetchReserves();
  return {};
});
