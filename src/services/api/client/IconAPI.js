import axios from '../../axios/client'

class IconAPI {
  constructor(apiEndpoint = 'icons') {
    this.apiEndpoint = apiEndpoint
  }
  async getIcons() {
    return new Promise((resolve, reject) => {
      axios
        .get(this.apiEndpoint)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data))
    })
  }
}

export default new IconAPI()
