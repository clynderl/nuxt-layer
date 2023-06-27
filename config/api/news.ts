const newsApi = {
  news: {
    list: (size: number, page: number) =>
      `/api/v1/news/?size=${size}&page=${page}`,
    detail: (slug: string) => `/api/v1/news/${slug}/`,
  },
};

export default newsApi;
