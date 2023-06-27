const claimApi = {
  claim: {
    create: '/api/v1/claim/',
    confirm: (uuid: string) => `/api/v1/claim/${uuid}/confirm/`,
    form: (uuid: string) => `/api/v1/claim/${uuid}/form/`,
    requisites: (uuid: string) => `/api/v1/claim/${uuid}/requisite/`,
    status: (uuid: string) => `/api/v1/claim/${uuid}/status/`,
  },
};

export default claimApi;
