import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const FlushTokenKey = 'flush-token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

export function setFlushToken (flushToken) {
  return Cookies.set(FlushTokenKey, flushToken)
}

export function getFlushToken () {
  return Cookies.get(FlushTokenKey)
}

export function removeFlushToken () {
  return Cookies.remove(FlushTokenKey)
}
