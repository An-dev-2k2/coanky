import BaseRESTFull from './BaseRESTFull'
import router from '../../router'

const axiosAdmin = new BaseRESTFull({
  baseURL: import.meta.env.VITE_APP_URL_API,
  tokenKey: 'adminToken',
  refreshUrl: 'admin/auth/refresh',
  onRefreshFail: () => {
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
  },
})

export default axiosAdmin.getInstance()
