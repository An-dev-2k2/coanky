import axios from '../../axios/admin'

class AudioAPI {
  constructor(apiEndpoint = 'admin/audios') {
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
  async create(formdata) {
    return new Promise((resolve, reject) => {
      axios
        .post(this.apiEndpoint, formdata, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data))
    })
  }
  async update(id, formdata) {
    return new Promise((resolve, reject) => {
      axios
        .put(this.apiEndpoint + '/' + id, formdata, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data))
    })
  }
  async delete(id) {
    return new Promise((resolve, reject) => {
      axios
        .delete(this.apiEndpoint + '/' + id)
        .then((res) => resolve(res.data))
        .catch((err) => reject(err.response.data))
    })
  }
}

export default new AudioAPI()
