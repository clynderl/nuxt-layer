import {useExchangeStore} from "../stores/exchangeStore";
import {storeToRefs} from "pinia";

let store = null;
export default () => {
  if (!store) {
    store = useExchangeStore();
  }

  const {directions} = storeToRefs(store);
  const {fetchDirections, fetchReserves} = store;

  return {
    directions,
    fetchDirections,
    fetchReserves,
  }
};
