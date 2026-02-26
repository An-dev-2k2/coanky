import axios from '../../axios/client'

class AppAPI {
  constructor(apiEndpoint = 'app') {
    this.apiEndpoint = apiEndpoint
  }
  async map(mapdata) {
    return new Promise((resolve, reject) => {
      axios
        .post(this.apiEndpoint + '/map', mapdata)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data))
    })
  }
}

export default new AppAPI()
