import axios from '../../axios/client'

class TourAPI {
  constructor(apiEndpoint = 'tours') {
    this.apiEndpoint = apiEndpoint
  }
  async getTours() {
    return new Promise((resolve, reject) => {
      axios
        .get(this.apiEndpoint)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data))
    })
  }
  async getDetail(slug) {
    return new Promise((resolve, reject) => {
      axios
        .get(this.apiEndpoint + '/' + slug)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data))
    })
  }
  async getMap(slug) {
    return new Promise((resolve, reject) => {
      axios
        .get(this.apiEndpoint + '/' + slug + '/map')
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data))
    })
  }
  async pay(slug) {
    return new Promise((resolve, reject) => {
      axios
        .post(this.apiEndpoint + '/' + slug + '/pay')
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data))
    })
  }
}

export default new TourAPI()
