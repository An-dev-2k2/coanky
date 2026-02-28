import axios from '../../axios/client'

class AuthAPI {
  async login(data) {
    return new Promise((resolve, reject) => {
      axios
        .post('auth/login', data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data))
    })
  }
  async register(data) {
    return new Promise((resolve, reject) => {
      axios
        .post('auth/register', data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data))
    })
  }
  async me() {
    return new Promise((resolve, reject) => {
      axios
        .get('auth/me')
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data))
    })
  }
}

export default new AuthAPI()
