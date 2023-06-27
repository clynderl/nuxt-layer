import useExchange from "../composables/useExchange";

export default defineNuxtPlugin( (ctx: any) => {
  if (ctx.payload.error) {
    return {};
  }
  const {fetchDirections, fetchReserves} = useExchange();

  fetchDirections();
  fetchReserves();
  return {};
});
