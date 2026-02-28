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
}

export default new TourAPI()
