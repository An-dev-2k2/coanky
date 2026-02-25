import axios from 'axios'
import { EventBus } from '../../eventBus'

class BaseRESTFull {
  constructor({ baseURL, tokenKey = 'token', refreshUrl, onRefreshFail = () => {} }) {
    this.tokenKey = tokenKey
    this.refreshUrl = refreshUrl
    this.onRefreshFail = onRefreshFail
    this.isRefreshing = false
    this.failedQueue = []

    this.api = axios.create({
      baseURL,
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })

    this._initializeRequestInterceptor()
    this._initializeResponseInterceptor()
  }

  // Xử lý hàng đợi các yêu cầu đang chờ refresh token
  processQueue(error, token = null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error)
      } else {
        prom.resolve(token)
      }
    })
    this.failedQueue = []
  }

  // Interceptor cho request
  _initializeRequestInterceptor() {
    this.api.interceptors.request.use(
      (config) => {
        const token = sessionStorage.getItem(this.tokenKey)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )
  }

  // Interceptor cho response
  _initializeResponseInterceptor() {
    const _this = this
    _this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        const originalRequest = error.config
        // Xử lý lỗi 403 chung
        if (error.response && error.response.status === 403) {
          // sessionStorage.removeItem(_this.tokenKey);
          // sessionStorage.removeItem('adminUser');
          _this.onRefreshFail()
          return Promise.reject(error) // Giữ nguyên hành vi
        }
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
          if (originalRequest.url.includes(_this.refreshUrl)) {
            sessionStorage.removeItem(_this.tokenKey)
            // this.onRefreshFail();
            return Promise.reject(error)
          }

          if (_this.isRefreshing) {
            return new Promise((resolve, reject) => {
              _this.failedQueue.push({ resolve, reject })
            })
              .then((token) => {
                originalRequest.headers['Authorization'] = `Bearer ${token}`
                return _this.api(originalRequest)
              })
              .catch((err) => Promise.reject(err))
          }

          originalRequest._retry = true
          _this.isRefreshing = true

          return new Promise(function (resolve, reject) {
            _this.api
              .post(_this.refreshUrl)
              .then(({ data }) => {
                const newToken = data.data
                sessionStorage.setItem(_this.tokenKey, newToken)
                _this.api.defaults.headers['Authorization'] = `Bearer ${newToken}`
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`
                _this.processQueue(null, newToken)
                resolve(_this.api(originalRequest))
              })
              .catch((err) => {
                _this.processQueue(err, null)
                _this.onRefreshFail()
                EventBus.emit('token-expired')
                reject(err)
              })
              .finally(() => {
                _this.isRefreshing = false
              })
          })
        }

        return Promise.reject(error)
      },
    )
  }

  getInstance() {
    return this.api
  }
}

export default BaseRESTFull
