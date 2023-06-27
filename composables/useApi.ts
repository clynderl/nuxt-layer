import {NitroFetchRequest} from 'nitropack';

const defaultParams = (method: any) => {
  const config = useRuntimeConfig();

  return {
    baseURL: config.public.backendBaseUrl,
    method: method.toUpperCase(),
  };
};

export function useGet(endpoint: NitroFetchRequest, params = {}) {
  return $fetch(endpoint, {...defaultParams('GET'), params});
}

export const useBasedFetch: typeof useFetch = (request, opts?) => {
  const config = useRuntimeConfig();

  return useFetch(request, {baseURL: config.public.backendBaseUrl as string, ...opts});
};
