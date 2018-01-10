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
    localStorageKeys: {
      userInfo: 'user-info'
    },
    eventHub: new Vue(),
    events: {
      updatePluginFileContent: 'update-plugin-file-content' // 更新插件内容
    },
    assets: {
      maleAvatar: 'static/images/avatar_male_1.jpg',
      femaleAvatar: 'static/images/avatar_female_1.jpg'
    },
    requestInfo: {
      baseUrl: 'https://talkapi.dei2.com',
      login: '/Zpm/user/login',
      register: '/Zpm/user/register',
      listPlugins: '/Zpm/plugin/list',
      viewFile: '/Zpm/plugin/content',
      updateUserInfo: '/Zpm/user/updateUserInfo'
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
    needlessLogin: ['Login', 'Register', 'Forget'] // 不需要登录的页面
  }
})

export default store

global.store = store
