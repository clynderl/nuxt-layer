import {acceptHMRUpdate} from 'pinia';

export const useExchangeStore = defineStore('exchange', () => {
  const {$api} = useNuxtApp();

  const directions = ref([]);
  const reserves = ref([]);

  const fromCurrenciesIds = ref<number[]>([]);
  const fromCurrencyId = ref<number | null>(null);
  const toCurrenciesIds = ref<number[]>([]);
  const toCurrencyId = ref(null);

  const fromDirection = ref({});
  const toDirection = ref({});

  const fromValue = ref('');
  const course = ref(null);

  const notifications = ref({});
  const inputs = ref({});
  const formValues = ref({from: {}, to: {}});
  const options = ref({
    from: [],
    to: [],
  });

  const isLoading = ref(false);
  const exchangeInfo = ref({});

  function setDirections(value) {
    directions.value = value;
  }

  async function fetchDirections() {
    const {data: directionsResponse, error: directionsError} =
      await useBasedFetch($api.calculator.list);
    if (!directionsError.value && directionsResponse.value) {
      setDirections(directionsResponse.value);
    }
  }

  async function fetchReserves() {
    const {data: reservesResponse, error: reservesError} =
      await useBasedFetch($api.calculator.reserves);
    if (!reservesError.value && reservesResponse.value) {
      reserves.value = reservesResponse.value;
    }
  }

  async function fetchToCurrenciesIds() {
    if (!fromCurrencyId.value) {
      return;
    }
    try {
      const response = await useGet(
        $api.calculator.toIds(fromCurrencyId.value)
      );
      if (response.length > 0) {
        toCurrenciesIds.value = response;
      }
    } catch (error) {
      console.log(error);
    }
  }

  function updateFormValues() {
    Object.keys(formValues.value).forEach((formValueKey) => {
      inputs.value[formValueKey].forEach((input) => {
        if (!([input.name] in formValues.value[formValueKey])) {
          formValues.value[formValueKey][input.name] = '';
        }
      });
    });
  }

  async function loadData() {
    if (!fromCurrencyId.value || !toCurrencyId.value) {
      return;
    }
    try {
      isLoading.value = true;
      const {
        notify,
        from,
        to,
        structure,
        course: pairCourse,
      } = await useGet(
        $api.calculator.pair(fromCurrencyId.value, toCurrencyId.value)
      );
      notifications.value = {
        main: notify,
        from: from.notify,
        to: to.notify,
      };
      inputs.value = {
        from: structure.from.input,
        to: structure.to.input,
      };
      updateFormValues();

      course.value = pairCourse;
      fromDirection.value.min = from.min ? from.min : to.min / pairCourse;
      fromDirection.value.max = from.max;
      fromDirection.value.round = from.round;
      toDirection.value.min = fromDirection.value.min * pairCourse;
      toDirection.value.max = to.max;
      toDirection.value.round = to.round;

      fromValue.value = fromDirection.value.min;

      // exchangeInfo.value = {
      //   min: from.min ? from.min : to.min / course,
      //   max: from.max,
      //   fromRound: from.round,
      //   toRound: to.round,
      //   course,
      // };
      options.value = {
        from: [],
        to: [],
      };
      if (structure.from.currency.length > structure.from.network.length) {
        options.value.from = structure.from.currency;
      } else {
        options.value.from = structure.from.network;
      }
      if (structure.to.currency.length > structure.to.network.length) {
        options.value.to = structure.to.currency;
      } else {
        options.value.to = structure.to.network;
      }
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function setToCurrencyId(value: number) {
    toCurrencyId.value = value;
    toDirection.value = getDirectionItem(value, {
      min: toDirection.value.min || 0,
      max: toDirection.value.max || 0,
      round: toDirection.value.round || 0,
    });

    await loadData();
  }

  async function setFromCurrencyId(value: number) {
    fromCurrencyId.value = value;
    fromDirection.value = getDirectionItem(value, {
      min: fromDirection.value.min || 0,
      max: fromDirection.value.max || 0,
      round: fromDirection.value.round || 0,
    });

    await fetchToCurrenciesIds();

    if (!toCurrencyId.value) {
      return;
    }

    if (
      toCurrencyId.value &&
      !toCurrenciesIds.value.includes(toCurrencyId.value)
    ) {
      toCurrencyId.value = toCurrenciesIds.value[0];
      toDirection.value = getDirectionItem(toCurrencyId.value, {
        min: toDirection.value.min || 0,
        max: toDirection.value.max || 0,
        round: toDirection.value.round || 0,
        value: toDirection.value.value || 0,
      });
    }

    await loadData();
  }

  async function setFromCurrenciesIds(
    value: number[],
    initialIds?: { from: number; to: number }
  ) {
    fromCurrenciesIds.value = value;

    if (fromCurrencyId.value && toCurrencyId.value) {
      await loadData();
      return;
    }
    if (!fromCurrencyId.value) {
      await setFromCurrencyId(initialIds?.from || value[0]);
    }
    if (!toCurrencyId.value) {
      await setToCurrencyId(initialIds?.to || toCurrenciesIds.value[0]);
    }
  }

  function getDirectionsList(ids: number[]) {
    const result: any[] = [];
    directions.value.forEach((direction: any) => {
      ids.every((id) => {
        if (direction.ids.includes(id)) {
          result.push({...direction, id});
          return false;
        }
        return true;
      });
    });
    return result;
  }

  function getDirectionItem(id: number, defaults?: any) {
    return {
      id,
      ...directions.value.find((direction) => direction.ids.includes(id)),
      ...defaults,
    };
  }

  const fromDirections = computed(() => {
    return getDirectionsList(fromCurrenciesIds.value);
  });

  // const fromDirection = computed(() => {
  //   if (!fromCurrencyId.value) {
  //     return {};
  //   }
  //   return getDirectionItem(fromCurrencyId.value);
  // });

  const toDirections = computed(() => {
    return getDirectionsList(toCurrenciesIds.value);
  });

  // const toDirection = computed(() => {
  //   if (!toCurrencyId.value) {
  //     return {};
  //   }
  //   return getDirectionItem(toCurrencyId.value);
  // });

  const toValue = computed(() => {
    if (fromValue.value === null) {
      return '';
    }
    return fromValue.value * course.value;
  });

  function handleFromInput(value) {
    fromValue.value = value;
  }

  function handleToInput(value) {
    fromValue.value = value / course.value;
  }

  function handleFromChange(value: number | string) {
    fromValue.value = value;
    nextTick(() => {
      if (value < fromDirection.value.min) {
        fromValue.value = fromDirection.value.min;
      } else if (value > fromDirection.value.max) {
        fromValue.value = fromDirection.value.max;
      }
    });
  }

  function handleToChange(value: number) {
    handleFromChange(value / course.value);
  }

  function getReserve(id) {
    return reserves.value.find((reserve) => reserve.id === id);
  }

  return {
    directions,
    fetchDirections,
    getReserve,
    fetchReserves,
    setFromCurrenciesIds,
    setFromCurrencyId,
    setToCurrencyId,
    fromCurrencyId,
    toCurrencyId,
    fromDirections,
    fromDirection,
    toDirections,
    toDirection,
    notifications,
    inputs,
    formValues,
    options,
    exchangeInfo,
    course,
    fromValue,
    toValue,
    handleFromInput,
    handleToInput,
    handleFromChange,
    handleToChange,
    isLoading,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useExchangeStore, import.meta.hot));
}

