/***
 **                                                          _ooOoo_
 **                                                         o8888888o
 **                                                         88' . '88
 **                                                         (| -_- |)
 **                                                          O\ = /O
 **                                                      ____/`---'\____
 **                                                    .   ' \\| |// `.
 **                                                     / \\||| : |||// \
 **                                                   / _||||| -:- |||||- \
 **                                                     | | \\\ - /// | |
 **                                                   | \_| ''\---/'' | |
 **                                                    \ .-\__ `-` ___/-. /
 **                                                 ___`. .' /--.--\ `. . __
 **                                              .'' '< `.___\_<|>_/___.' >'''.
 **                                             | | : `- \`.;`\ _ /`;.`/ - ` : | |
 **                                               \ \ `-. \_ __\ /__ _/ .-` / /
 **                                       ======`-.____`-.___\_____/___.-`____.-'======
 **                                                          `=---='
 **
 **                                       .............................................
 **                                              佛祖保佑             永无BUG
 **                                      佛曰:
 **                                              写字楼里写字间，写字间里程序员；
 **                                              程序人员写程序，又拿程序换酒钱。
 **                                              酒醒只在网上坐，酒醉还来网下眠；
 **                                              酒醉酒醒日复日，网上网下年复年。
 **                                              但愿老死电脑间，不愿鞠躬老板前；
 **                                              奔驰宝马贵者趣，公交自行程序员。
 **                                              别人笑我忒疯癫，我笑自己命太贱；
 **                                              不见满街漂亮妹，哪个归得程序员？
 */
/**
 * Created by liangshan on 2017/7/13.
 */
import * as types from './mutation-types'
import axios from 'axios'
import utils from '../utils'
const querystring = require('querystring')
const instance = axios.create({
  timeout: 3000
})
const noop = function () {}
export const actions = {
  async [types.LOGIN] ({commit, state}, data) {
    let callback = noop
    let error = noop
    if (data.callback) {
      callback = data.callback
      delete data.callback
    }
    if (data.error) {
      error = data.error
      delete data.error
    }
    let loginData = await instance({
      method: 'post',
      baseURL: state.requestInfo.baseUrl,
      url: state.requestInfo.login,
      data: querystring.stringify(data)
    })
    if (loginData.config) {
      delete loginData.config
    }
    if (loginData.status === 200) {
      callback(loginData.data)
    } else {
      error(loginData)
    }
  },
  async [types.REGISTER] ({commit, state}, data) {
    let callback = noop
    let error = noop
    if (data.callback) {
      callback = data.callback
      delete data.callback
    }
    if (data.error) {
      error = data.error
      delete data.error
    }
    let registerData = await instance({
      method: 'post',
      baseURL: state.requestInfo.baseUrl,
      url: state.requestInfo.register,
      data: querystring.stringify(data)
    })
    if (registerData.config) {
      delete registerData.config
    }
    if (registerData.status === 200) {
      callback(registerData.data)
    } else {
      error(registerData)
    }
  },
  [types.AJAX] ({commit, state}, data) {
    return new Promise((resolve, reject) => {
      let params = JSON.parse(JSON.stringify(data))
      if (params.url === '') {
        reject(new Error('url不能为空'))
      }
      // 自动添加token,phonenum
      if (!params.data.token) {
        params.data.token = state.loginInfo.token
      }
      if (!params.data.phonenum) {
        params.data.phonenum = state.loginInfo.phonenum
      }
      instance({
        method: params.method || 'post',
        baseURL: params.baseUrl || state.requestInfo.baseUrl,
        url: params.url,
        data: querystring.stringify(params.data)
      }).then((res) => {
        if (res.config) {
          delete res.config
        }
        if (res.status === 200) {
          resolve(res.data)
        } else {
          reject(res)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  [types.AJAX2] ({commit, state}, data) {
    return new Promise((resolve, reject) => {
      let params = JSON.parse(JSON.stringify(data))
      if (params.url === '') {
        reject(new Error('url不能为空'))
      }
      instance({
        method: params.method || 'post',
        baseURL: params.baseUrl || state.requestInfo.baseUrl,
        url: params.url,
        data: querystring.stringify(params.data)
      }).then((res) => {
        if (res.config) {
          delete res.config
        }
        if (res.status === 200) {
          resolve(res.data)
        } else {
          reject(res)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取用户信息
  async [types.GET_USER_INFO] ({commit, state}, data) {
    let callback = noop
    let error = noop
    if (data.callback) {
      callback = data.callback
      delete data.callback
    }
    if (data.error) {
      error = data.error
      delete data.error
    }
    let userData = await instance({
      method: 'post',
      baseURL: state.requestInfo.baseUrl,
      url: state.requestInfo.getUserInfo,
      data: querystring.stringify(data)
    })
    if (userData.config) {
      delete userData.config
    }
    if (userData.status === 200) {
      callback(userData.data)
    } else {
      error(userData)
    }
  },
  // 更新用户信息
  async [types.UPDATE_USER_INFO] ({commit, state}, data) {
    let callback = noop
    let error = noop
    if (data.callback) {
      callback = data.callback
      delete data.callback
    }
    if (data.error) {
      error = data.error
      delete data.error
    }
    let userData = await instance({
      method: 'post',
      baseURL: state.requestInfo.baseUrl,
      url: state.requestInfo.updateUserInfo,
      data: querystring.stringify(data)
    })
    if (userData.config) {
      delete userData.config
    }
    if (userData.status === 200) {
      callback(userData.data)
    } else {
      error(userData)
    }
  },
  // 修改密码
  async [types.MODIFY_PASSWORD] ({commit, state}, data) {
    let callback = noop
    let error = noop
    if (data.callback) {
      callback = data.callback
      delete data.callback
    }
    if (data.error) {
      error = data.error
      delete data.error
    }
    let userData = await instance({
      method: 'post',
      baseURL: state.requestInfo.baseUrl,
      url: state.requestInfo.modifyPassword,
      data: querystring.stringify(data)
    })
    if (userData.config) {
      delete userData.config
    }
    if (userData.status === 200) {
      callback(userData.data)
    } else {
      error(userData)
    }
  },
  async [types.SAVE_MESSAGE] ({commit, state}, data) {
    return new Promise((resolve, reject) => {
      data.uuid = utils.getUUID()
      instance({
        method: 'post',
        baseURL: state.requestInfo.baseUrl,
        url: state.requestInfo.saveMessage,
        data: querystring.stringify(data)
      }).then(saveData => {
        if (saveData.config) {
          delete saveData.config
        }
        if (saveData.status === 200) {
          resolve(saveData.data)
        } else {
          reject(saveData)
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  async [types.SEND_MESSAGE] ({commit, state}, data) {
    let _data = JSON.parse(JSON.stringify(data))
    Object.assign(_data.message, {
      sendTime: (+new Date())
    })
    let _formData = JSON.parse(JSON.stringify(_data))
    _formData.token = state.loginInfo.token
    _formData.phonenum = state.loginInfo.phonenum
    if (_formData.from) {
      _data.from = JSON.parse(JSON.stringify(_formData.from))
      _formData.from = JSON.stringify(_formData.from)
    } else {
      _data.from = {
        phonenum: state.loginInfo.phonenum,
        username: state.loginInfo.username,
        role: state.loginInfo.role
      }
      _formData.from = JSON.stringify(_data.from)
    }
    if (_formData.to) {
      _formData.to = JSON.stringify(_formData.to)
    }
    if (_formData.message) {
      _formData.message = JSON.stringify(_formData.message)
    }
    let savedMessageData = await this.dispatch(types.SAVE_MESSAGE, _formData)
    if (savedMessageData.status === 200) {
      _data.message.uuid = savedMessageData.data.uuid
    }
    state.socket.client.emit(state.socket.event, _data)
  }
}
