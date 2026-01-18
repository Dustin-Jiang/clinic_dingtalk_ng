import axios from 'axios'

const Api = axios.create({
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken'
})

enum ReqState {
  IDLE,
  PENDING,
  SUCCESS,
  ERROR
}

export default Api
export { ReqState }
