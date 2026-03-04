import axios from '../../axios/admin'

class AppAPI {
  constructor(apiEndpoint = 'admin/apps') {
    this.apiEndpoint = apiEndpoint
  }

  async getDashboard(data) {
    return new Promise((resolve, reject) => {
      axios
        .post(this.apiEndpoint + '/dashboard', data)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data))
    })
  }
  async getTransactions() {
    return new Promise((resolve, reject) => {
      axios
        .get(this.apiEndpoint + '/transactions')
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data))
    })
  }
}

export default new AppAPI()
