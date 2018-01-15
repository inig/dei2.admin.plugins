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
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as mutations from './mutations'
import * as getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  actions: actions.actions,
  mutations: mutations.mutations,
  getters: getters.getters,
  state: {
    username: 'ls',
    author: '智愚',
    password: '123123',
    appName: 'ZPM_PLUGINS后台管理系统2',
    shortAppName: 'ZPM_PLUGINS',
    socket: {},
    localStorageKeys: {
      userInfo: 'user-info'
    },
    eventHub: new Vue(),
    events: {
      getNewMessage: 'get-new-message', // 获取到新消息
      updatePluginFileContent: 'update-plugin-file-content', // 更新插件内容
      updatePluginList: 'update-plugin-list', // 更新我的插件列表
      updateAvatar: 'update-avatat' // 更新我的头像
    },
    assets: {
      maleAvatar: 'static/images/avatar_male_1.jpg',
      femaleAvatar: 'static/images/avatar_female_1.jpg'
    },
    requestInfo: {
      // baseUrl: 'http://127.0.0.1:3000',
      baseUrl: 'https://talkapi.dei2.com',
      login: '/Zpm/user/login',
      register: '/Zpm/user/register',
      modifyPassword: '/Zpm/user/modifyPassword',
      listUsers: 'Zpm/user/list',
      listAllPlugins: 'Zpm/plugin/listAll', // 插件列表，用于root、admin插件管理
      updateUserSettings: 'Zpm/user/updateUserSettings',
      updatePluginSettings: 'Zpm/plugin/updatePluginSettings', // 审核插件
      deletePlugin: 'Zpm/plugin/deletePlugin',
      deleteUser: 'Zpm/user/deleteUser',
      listPlugins: '/Zpm/plugin/list',
      viewFile: '/Zpm/plugin/content',
      updatePluginFileContent: '/Zpm/plugin/update',
      getUserInfo: '/Zpm/user/getUserInfo',
      updateUserInfo: '/Zpm/user/updateUserInfo',
      queryUsers: '/Zpm/user/queryUsers', // 查询用户列表，模糊查询。不需要管理员权限
      saveMessage: '/Zpm/message/save', // 保存消息
      readMessage: '/Zpm/message/read' // 将消息置为已读
    },
    loginInfo: {
      expireTime: 24 * 60 * 60 * 1000, // 登录失效时间
      data: {}
    },
    loaders: {}, // 页面中所有loader对象
    contentRouterViewLoader: 'content-router-view-loader',
    homeRouterViewLoader: 'home-router-view-loader',
    loadingType: 'ball-triangle-path', // loading样式
    allPlugins: [],
    allRoles: [
      {
        value: 1,
        name: '超级管理员'
      },
      {
        value: 2,
        name: '管理员'
      },
      {
        value: 3,
        name: '开发者'
      },
      {
        value: 4,
        name: '普通用户'
      }
    ],
    needlessLogin: ['Login', 'Register', 'Forget'] // 不需要登录的页面
  }
})

export default store

global.store = store
