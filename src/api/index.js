import http from '../utils/http'
export default function api (url, method, params) {
  if (method === 'get') {
    return http.get(url, { params })
  } else {
    return http.post(url, params)
  }
}
