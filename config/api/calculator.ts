const calculatorApi = {
  calculator: {
    list: '/api/v1/calculator/',
    fromIds: '/api/v1/calculator/from/',
    course: (from: number, to: number) =>
      `/api/v1/calculator/course/${from}/${to}/`,
    pair: (from: number, to: number) =>
      `/api/v1/calculator/pair/${from}/${to}/`,
    toIds: (from: number) => `/api/v1/calculator/from/${from}/`,
    reserves: '/api/v1/calculator/reserves/',
    settings: (from: string, to: string) =>
      `/api/v1/calculator/settings/?cur_from=${from}&cur_to=${to}`,
    tech: '/api/v1/calculator/tech/',
  },
};

export default calculatorApi;
