import apiConfig from "../config/apiConfig";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      api: apiConfig,
    },
  };
});
