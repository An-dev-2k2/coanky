import axios from '../../axios/admin'

class AuthAPI {
  constructor(apiEndpoint = 'admin/auth') {
    this.apiEndpoint = apiEndpoint
  }
  async login(credentials) {
    return new Promise((resolve, reject) => {
      axios
        .post(this.apiEndpoint + '/login', credentials)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data))
    })
  }
  async logout() {
    return new Promise((resolve, reject) => {
      axios
        .post(this.apiEndpoint + '/logout')
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data))
    })
  }
}

export default new AuthAPI()
