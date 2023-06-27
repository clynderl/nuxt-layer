const usersApi = {
  users: {
    me: '/api/v1/users/me/',
    signup: '/api/v1/users/signup/',
    restore: '/api/v1/users/restore/',
    claims: (page: number, size: number) =>
      `/api/v1/users/me/claims/?page=${page}&size=${size}`,
    reactivate: '/api/v1/users/reactivate/',
    password: '/api/v1/users/me/password/',
    referral: {
      balance: '/api/v1/users/me/refferal/',
      dw: '/api/v1/users/me/refferal/dw/',
      withdraw: '/api/v1/users/me/refferal/withdrawal/',
    },
  },
};

export default usersApi;
