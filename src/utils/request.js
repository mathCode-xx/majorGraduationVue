import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'
import { checkToken } from '@/utils/token'

const TOKEN_EXP_CODE = 'A000203'
const FLUSH_TOKEN_EXP_CODE = 'A000202'

// 定义重试请求的函数
function retryRequest (config, retryLimit) {
  config.retry = true
  console.log('重试请求：' + config.url + '剩余请求次数' + retryLimit)
  if (retryLimit <= 0) {
    // 达到重试次数上限，直接返回错误
    return Promise.reject(new Error('网络错误！'))
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      service.request(config)
        .then((response) => {
          const { data } = response
          if (data.code === TOKEN_EXP_CODE) {
            // 继续重试
            resolve(retryRequest(config, retryLimit - 1))
          } else {
            // 成功响应
            resolve(response)
          }
        })
        .catch((error) => {
          // 请求失败，直接返回错误
          resolve(Promise.reject(error))
        })
    }, 1000) // 延迟1秒后重试
  })
}

// create an axios instance
const service = axios.create({
  baseURL: 'http://localhost:8081',
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      config.headers.token = getToken()
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    if (response.config.retry) {
      return res
    }

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== '0') {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === FLUSH_TOKEN_EXP_CODE) {
        // to re-login
        MessageBox.confirm('登录已过期，是否重新登录', '登录确认', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          router.push('/login')
        })
        return res
      } else if (res.code === TOKEN_EXP_CODE) {
        console.log(response.config)
        checkToken()
        const originalRequest = response.config
        return retryRequest(originalRequest, 5) // 最多重试5次
      } else {
        Message({
          message: res.message || '网络错误',
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject(new Error(res.message || '网络错误'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
