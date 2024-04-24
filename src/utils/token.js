import { getFlushToken, getToken, setToken } from '@/utils/auth'
import { flushToke } from '@/api/user'
import { MessageBox } from 'element-ui'
import router from '@/router'
import store from '@/store'

const MIN_TIME = 5 * 60 * 1000

let flushTaskId

export function startFlushTask () {
  if (!flushTaskId) {
    // 防止重复启动
    flushTaskId = setInterval(checkToken, 1000 * 20)
  }
}

function checkToken () {
  if (needFlushToken(getToken())) {
    console.log('需要刷新token')
    if (flushTaskId) {
      // 需要刷新token时先清理掉定时任务，防止重复刷新token
      clearInterval(flushTaskId)
      flushTaskId = undefined
    }
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
      })
    }
  } else {
    console.log('不需要刷新token')
  }
}

function parseJwt (token) {
  // console.log('parseJwt')
  try {
    const base64Url = token.split('.')[1] // 解码第二部分（载荷部分）
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/') // 替换特殊字符
    const payload = JSON.parse(atob(base64)) // base64 解码并转换为 JSON
    console.log('token解析成功')
    console.log(payload)
    return payload
  } catch (error) {
    console.log('token解析失败')
    return null // 解析失败，返回 null
  }
}

function getExpirationTime (token) {
  const tokenPayload = parseJwt(token) // 解析 JWT
  // console.log('开始检测token是否过期')
  if (!tokenPayload || !tokenPayload.exp) {
    // 没有有效载荷或过期时间
    return true
  }
  return tokenPayload.exp // 获取过期时间戳（单位：毫秒）
}

function needFlushToken (token) {
  const expirationTime = getExpirationTime(token)
  const currentTime = Math.floor(Date.now()) // 当前时间戳（单位：毫秒）
  // 如果剩余时间小于MIN_TIME则返回false
  console.log('当前时间' + currentTime)
  console.log('token过期时间' + expirationTime)
  return expirationTime - currentTime <= MIN_TIME
}

function isFlushTokenExpired (flushToken) {
  const expirationTime = getExpirationTime(flushToken)
  return Math.floor(Date.now()) >= expirationTime
}
