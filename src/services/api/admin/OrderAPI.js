import axios from '../../axios/admin'

class OrderAPI {
  constructor(apiEndpoint = 'admin/orders') {
    this.apiEndpoint = apiEndpoint
  }
  async get(params = {}) {
    return new Promise((resolve, reject) => {
      axios
        .get(this.apiEndpoint, { params })
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data))
    })
  }
}

export default new OrderAPI()
