import BaseRESTFull from './BaseRESTFull'

const axiosClient = new BaseRESTFull({
  baseURL: import.meta.env.VITE_APP_URL_API,
  tokenKey: 'token',
  refreshUrl: 'auth/refresh',
  onRefreshFail: () => {
    sessionStorage.removeItem('token')
  },
})

export default axiosClient.getInstance()
