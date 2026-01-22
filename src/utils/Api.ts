import axios from 'axios'
import { productionConfig, developmentConfig } from './config'

const config = developmentConfig

const Api = axios.create({
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
})

Api.interceptors.request.use((req) => {
  // save real url in headers[url]
  if (req.headers) {
    req.headers['url'] = config.baseUrl + req.url
    req.headers['user-token'] = localStorage.getItem('user-token')
  } else {
    // @ts-ignore
    req.headers = {
      url: req.url
    }
  }
  req.url = config.proxyUrl
  return req
})

const User = axios.create({
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
})

User.interceptors.request.use((req) => {
  // save real url in headers[url]
  if (req.headers) {
    req.headers['url'] = config.baseUrl + req.url
    req.headers['user-token'] = localStorage.getItem('user-token')
  } else {
    // @ts-ignore
    req.headers = {
      url: req.url
    }
  }
  req.url = config.userUrl
  return req
})

enum ReqState {
  IDLE,
  PENDING,
  SUCCESS,
  ERROR
}

export default Api
export { ReqState, User }
