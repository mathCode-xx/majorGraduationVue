import { getFlushToken, getToken, setToken } from '@/utils/auth'
import { flushToke } from '@/api/user'
import { MessageBox } from 'element-ui'
import router from '@/router'
import store from '@/store'

// 如果token持续时间小于MIN_TIME秒则刷新
const MIN_TIME = 3 * 60

let flushTaskId

export function startFlushTask () {
  console.log('启动token定时检测任务' + flushTaskId)
  if (!flushTaskId) {
    // 防止重复启动
    flushTaskId = setInterval(checkToken, 1000 * 60 * 3)
  }
}

export function clearFlushTask () {
  console.log('取消token定时检测任务' + flushTaskId)
  if (flushTaskId) {
    clearInterval(flushTaskId)
    flushTaskId = undefined
  }
}

export function checkToken () {
  if (needFlushToken(getToken())) {
    clearFlushTask()
    const flushToken = getFlushToken()
    if (isFlushTokenExpired(flushToken)) {
      MessageBox.confirm('登录已过期，是否重新登录', '登录确认', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        router.push('/login')
      })
    } else {
      flushToke(flushToken).then(resp => {
        const { data } = resp
        store.commit('user/SET_TOKEN', data)
        setToken(data)
        startFlushTask()
      })
    }
  }
}

export function getUserFromToken () {
  const payload = parseJwt(getToken())
  const userJson = payload.user
  return JSON.parse(userJson)
}

function parseJwt (token) {
  try {
    const base64Url = token.split('.')[1] // 解码第二部分（载荷部分）
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/') // 替换特殊字符
    const payload = JSON.parse(atob(base64)) // base64 解码并转换为 JSON
    return payload
  } catch (error) {
    return null // 解析失败，返回 null
  }
}

function getExpirationTime (token) {
  const tokenPayload = parseJwt(token) // 解析 JWT
  if (!tokenPayload || !tokenPayload.exp) {
    // 没有有效载荷或过期时间
    return 0
  }
  return tokenPayload.exp // 获取过期时间戳（单位：秒）
}

function needFlushToken (token) {
  const expirationTime = getExpirationTime(token)
  const currentTime = Math.floor(Date.now() / 1000) // 当前时间戳（单位：秒）
  // 如果剩余时间小于MIN_TIME则返回false
  console.log('token过期时间' + expirationTime)
  console.log('当前时间' + currentTime)
  return (expirationTime - currentTime) <= MIN_TIME
}

function isFlushTokenExpired (flushToken) {
  const expirationTime = getExpirationTime(flushToken)
  console.log('flush token exp: ' + expirationTime)
  const currentTime = Math.floor(Date.now() / 1000) // 当前时间戳（单位：秒）
  return currentTime >= expirationTime
}
