/***
 **                                                          _ooOoo_
 **                                                         o8888888o
 **                                                         88" . "88
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
 **                                              ."" '< `.___\_<|>_/___.' >'"".
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

const findTemplateByUUID = function (uuid, arr, deep, sub) {
  let _deep = deep // deep为1或2
  let _sub = sub || 0
  let outIndex = [-1, -1]
  if (--_deep > -1) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].uuid === uuid) {
        outIndex[_deep + _sub] = i
        i = arr.length
      } else {
        let _tempIndex = findTemplateByUUID(uuid, arr[i].children, _deep, deep - _deep)[1]
        if (_tempIndex > -1) {
          outIndex[0] = i
          outIndex[1] = _tempIndex
        }
      }
    }
  }
  return outIndex
}

export const mutations = {
  [types.SHOW_POPUP] (state, data) {
    state.popup = Object.assign({}, state.popup, data, {
      shown: true
    })
  },
  [types.SET_ALL_PLUGINS] (state, data) {
    state.allPlugins = data.allPlugins
  },
  [types.SET_LOADER] (state, data) {
    state.loaders[data.name] = data.value.vm
  },
  [types.DEL_LOADER] (state, data) {
    if (state.loaders[data.name]) {
      delete state.loaders[data.name]
    }
  },
  [types.SET_SOCKET] (state, data) {
    state.socket.client = data.socket
  },
  [types.UPDATE_LOGIN_INFO] (state, data) {
    state.loginInfo = data
  },
  [types.DISCONNECT_SOCKETIO] (state) {
    state.socket.client.disconnect()
    state.socket.client = {}
  },
  [types.UPDATE_AVATAR] (state, data) {
    state.loginInfo.headIcon = data.avatar
  },
  [types.TOGGLE_MENU] (state, data) {
    state.spanLeft = (state.spanLeft === state.minSpanLeft ? state.maxSpanLeft : state.minSpanLeft)
    state.spanRight = (state.spanRight === state.maxSpanRight ? state.minSpanRight : state.maxSpanRight)
    state.menuFold = (state.spanLeft === state.minSpanLeft)
  },
  [types.FOLD_SIDE_MENU] (state, data) {
    state.spanLeft = data.fold ? state.minSpanLeft : state.maxSpanLeft
    state.spanRight = data.fold ? state.maxSpanRight : state.minSpanRight
    state.menuFold = data.fold
  },
  [types.TOGGLE_FULL_SCREEN] (state, data) {
    state.isFullScreen = data.isFullScreen
  },
  [types.SET_SIMULATOR] (state, data) {
    Object.assign(state.simulator, data)
  },
  [types.ACTIVE_COMPONENT] (state, data) {
    Object.assign(state.activeComponent, data)
  },
  [types.INIT_LOCAL_TEMPLATE] (state, data) {
    state.pageData = data.template
  },
  [types.PREV_PAGE] (state) {
    // 上一页
    if (state.currentPageIndex > 0) {
      state.currentPageIndex -= 1
    }
  },
  [types.NEXT_PAGE] (state) {
    // 下一页
    if (state.currentPageIndex < state.pageData.length - 1) {
      state.currentPageIndex += 1
    }
  },
  [types.SET_CURRENT_PAGE_INDEX] (state, data) {
    if (Number(data.index) >= 0 && Number(data.index) <= state.pageData.length - 1) {
      state.currentPageIndex = Number(data.index)
    }
  },
  [types.SAVE_LOCAL_TEMPLATE] (state, data) {
    /**
     * type: zpm-page
     * uuid: xxxxxxx
     * template: {}
     */
    let _pageData = state.pageData
    let _pageIndex = -1
    let _componentIndex = -1
    if (data.type === state.simulatorPageType) {
      // 是页面
      _pageIndex = findTemplateByUUID(data.uuid, _pageData, 1)[0]
      if (_pageIndex === -1) {
        // 不存在，是新页面
        _pageData.push(data.template)
      } else {
        // 存在，替换原有页面模板
        _pageData.splice(_pageIndex, 1, data.template)
      }
    } else {
      // 是页面中的组件
      let _index = findTemplateByUUID(data.uuid, _pageData, 2)
      _pageIndex = _index[0]
      _componentIndex = _index[1]
      if (_pageIndex !== -1) {
        // 页面必须存在
        if (_componentIndex === -1) {
          // 是新组件，添加新组件
          _pageData[_pageIndex].children.push(data.template)
        } else {
          // 不是新组件，替换
          _pageData[_pageIndex].children.splice(_componentIndex, 1, data.template)
        }
      }
    }
  }
}
