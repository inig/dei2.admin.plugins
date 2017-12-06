/**
 * Created by liangshan on 2017/12/6.
 */

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

export default {
  storage: _storage,
  isEmptyObj: _isEmptyObj
}
