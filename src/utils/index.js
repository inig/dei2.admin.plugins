/**
 * Created by liangshan on 2017/12/6.
 */

function S4 () {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}
function getUUID (prefix) {
  return ((prefix || '') + S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
}

const _getItem = function (name) {
  let _value = localStorage.getItem(name) || ''
  try {
    _value = JSON.parse(_value)
  } catch (err) {
  }
  return _value
}

const _setItem = function (name, value) {
  let _value = value
  if (typeof value !== 'string') {
    _value = JSON.stringify(value)
  }
  localStorage.setItem(name, _value)
}

const _removeItem = function (name) {
  if (localStorage.hasOwnProperty(name)) {
    localStorage.removeItem(name)
  }
}

const _clear = function () {
  localStorage.clear()
}

const _storage = {
  getItem: _getItem,
  setItem: _setItem,
  removeItem: _removeItem,
  clear: _clear
}

const _isEmptyObj = function (obj) {
  let t
  for (t in obj) {
    return !1
  }
  return !0
}

let kit = {}
kit.title = function (title) {
  window.document.title = (title || '智愚')
}

export default {
  storage: _storage,
  isEmptyObj: _isEmptyObj,
  getUUID: getUUID,
  kit: kit
}
