import axios from 'axios'
import router from '../router'
// import store from '..//store'
import { Toast } from 'vant'

const http = axios.create()
http.defaults.baseURL = 'http://111.230.181.212:8081/jikezhu'
http.defaults.timeout = 10000
http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
let loading
http.interceptors.request.use(
  config => {
    loading = Toast.loading({
      message: '加载中...',
      forbidClick: true,
      duration: 0
    })
    // const token = 'Bearer ' + store.state.token
    // token && (config.headers.Authorization = token)
    return config
  },
  error => {
    loading.clear()
    Toast({
      message: '请求异常',
      duration: 1500,
      forbidClick: true
    })
    return Promise.error(error)
  }
)

http.interceptors.response.use(
  response => {
    if (response.status === 200) {
      loading.clear()
      return Promise.resolve(response)
    } else {
      loading.clear()
      return Promise.reject(response)
    }
  },
  async (error) => {
    console.log(error)
    loading.clear()
    if (error.response && error.response.status) {
      switch (error.response.status) {
        case 401:
          Toast({
            message: '未登录',
            duration: 1500,
            forbidClick: true
          })
          await new Promise(resolve => {
            setTimeout(() => {
              resolve()
            }, 1500)
          })
          router.replace({
            path: '/',
            query: {
              redirect: router.currentRoute.fullPath
            }
          })
          localStorage.removeItem('token')
          localStorage.removeItem('userinfo')
          break
        default:
          Toast({
            message: '服务器出错',
            duration: 1500,
            forbidClick: true
          })
          break
      }
    } else {
      Toast({
        message: '服务器出错',
        duration: 1500,
        forbidClick: true
      })
    }
    return Promise.reject(error.response)
  }
)
export default http
