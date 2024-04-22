import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

const UserName = 'User-Name'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserName() {
  return Cookies.get(UserName)
}

export function setUserName(username) {
  return Cookies.set(UserName, username)
}

export function removeUserName() {
  return Cookies.remove(UserName)
}
