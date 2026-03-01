import axios from '../../axios/admin'

class OrderAPI {
  constructor(apiEndpoint = 'admin/orders') {
    this.apiEndpoint = apiEndpoint
  }
  async get() {
    return new Promise((resolve, reject) => {
      axios
        .get(this.apiEndpoint)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data))
    })
  }
}

export default new OrderAPI()
