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
import * as getters from './getters'
import * as mutations from './mutations'

Vue.use(Vuex)

const PROTOCOL = location.protocol

const store = new Vuex.Store({
  actions: actions.actions,
  mutations: mutations.mutations,
  getters: getters.getters,
  state: {
    username: 'ls',
    author: '智愚',
    password: '123123',
    appName: 'ZPM_PLUGINS',
    fullAppName: 'ZPM_PLUGINS后台管理系统',
    shortAppName: 'Z',
    spanLeft: 5,
    spanRight: 19,
    maxSpanLeft: 5,
    maxSpanRight: 23,
    minSpanLeft: 1,
    minSpanRight: 19,
    isFullScreen: false,
    menuFold: false, // 左侧菜单是否折叠
    appHeaderOperationArea: {}, // header空白区域
    fullScreenPopup: {
      shown: false,
      subCom: {},
      subComStyle: {}
    },
    simulator: {
      name: 'iPhone 6',
      width: 375,
      height: 667,
      dpr: 2,
      scale: 1
    },
    grid: {
      shown: true,
      lineWidth: 1,
      lineColor: '#bbb',
      lineCountX: 10,
      lineCountY: 20,
      alignmentLineWidth: 2, // 对齐线宽度
      alignmentLineColor: '#9900CC', // 对齐线颜色
      alignmentLineSensitive: 10 // 小于10px显示对齐线
    }, // 辅助网格线
    activePosition: {
      left: 1,
      top: 1,
      right: 1,
      bottom: 1,
      center: 1, // 水平方向
      middle: 1 // 竖直方向
    },
    activeComponent: {
      uuid: '',
      type: '',
      template: {}
    },
    activityInfoChanged: false, // 用户是否编辑了活动内容，活动内容有变化则能保存，否则不用保存
    simulatorPageType: 'zpm-page',
    pageData: [], // 活动模板数据
    activityInfo: {}, // 活动模板数据
    currentPageIndex: 0,
    article: {
      comments: {}
    },
    socket: {
      server: PROTOCOL + '//wss.dei2.com',
      // server: PROTOCOL + '//127.0.0.1',
      port: '3010',
      path: '/sk',
      event: 'enkel-message',
      client: {}
    },
    socketEvents: {
      changeUserRole: 'change-user-role',
      reviewPlugin: 'review-plugin',
      sendMessage: 'send-message'
    },
    localStorageKeys: {
      userInfo: 'user-info'
    },
    eventHub: new Vue(),
    allArticleTags: [],
    online: true,
    events: {
      bodyClick: 'body-click',
      simulatorChanged: 'simulator-changed', // 模拟器属性变化
      activeComponentChanged: 'active-component-changed', // 激活状态的组件变化
      saveActivity: 'save-activity', // 保存活动
      saveActivityBefore: 'save-activity-before', // 开始保存活动
      saveActivityCallback: 'save-activity-callback', // 保存活动回调
      removeActivity: 'remove-activity', // 删除了一个活动
      getNewMessage: 'get-new-message', // 获取到新消息
      updatePluginFileContent: 'update-plugin-file-content', // 更新插件内容
      updatePluginList: 'update-plugin-list', // 更新我的插件列表
      updateAvatar: 'update-avatar', // 更新我的头像
      readMessage: 'read-message', // 消息置为已读
      mainContentSizeChange: 'main-content-size-change',
      frontArticleLogin: 'front-article-login',
      frontArticleRegister: 'front-article-register',
      frontArticleCloseCommentList: 'front-article-close-comment-list'
    },
    assets: {
      maleAvatar: '/static/images/avatar_male_1.jpg',
      femaleAvatar: '/static/images/avatar_female_1.jpg',
      defaultActivity127x200: '/static/images/127x200.png',
      inigLogo: '/static/images/inig.png',
      articleAlbum: 'https://static.dei2.com/live/images/article.jpeg',
      ads: {
        inig: '/static/images/ads/logo_inig_3.jpg',
        dei2: '/static/images/ads/logo_dei2_2.jpg'
      }
    },
    requestInfo: {
      // baseUrl: PROTOCOL + '//127.0.0.1:3000',
      baseUrl: PROTOCOL + '//talkapi.dei2.com',
      login: '/Zpm/user/login',
      register: '/Zpm/user/register',
      modifyPassword: '/Zpm/user/modifyPassword',
      listUsers: '/Zpm/user/list',
      listAllPlugins: '/Zpm/plugin/listAll', // 插件列表，用于root、admin插件管理
      updateUserSettings: '/Zpm/user/updateUserSettings',
      updatePluginSettings: '/Zpm/plugin/updatePluginSettings', // 审核插件
      deletePlugin: '/Zpm/plugin/deletePlugin',
      deleteUser: '/Zpm/user/deleteUser',
      listPlugins: '/Zpm/plugin/list',
      viewFile: '/Zpm/plugin/content',
      updatePluginFileContent: '/Zpm/plugin/update',
      getUserInfo: '/Zpm/user/getUserInfo',
      updateUserInfo: '/Zpm/user/updateUserInfo',
      queryUsers: '/Zpm/user/queryUsers', // 查询用户列表，模糊查询。不需要管理员权限
      saveMessage: '/Zpm/message/save', // 保存消息
      updateMessage: '/Zpm/message/update', // 修改将消息状态 status:  0 删除, 1 未读, 2 已读
      queryMessage: '/Zpm/message/list', // 查询消息列表
      countMessage: '/Zpm/message/count', // 查询消息的总条数
      listActivity: '/Zpm/activity/list', // 查询所有活动
      createActivity: '/Zpm/activity/create', // 新建活动
      editActivity: '/Zpm/activity/edit', // 编辑活动
      deleteActivity: '/Zpm/activity/delete', // 删除活动
      getActivity: '/Zpm/activity/getTemplateData', // 获取活动模板数据
      getPreviewActivity: '/Zpm/activity/getPreviewTemplateData', // 获取活动预览数据
      listArticle: '/Zpm/article/list', // 查询文章列表
      saveArticle: '/Zpm/article/save', // 保存文章内容
      createArticle: '/Zpm/article/create', // 新建文章
      getAllArticle: '/Zpm/article/getAll', // 获取文章列表，不需要登录状态
      viewArticle: '/Zpm/article/content', // 根据文章id查询文章内容
      getAllTags: '/Zpm/tag/getAll', // 获取所有文章的标签
      modifyTag: '/Zpm/article/modifyTag', // 修改文章标签
      getAllComments: '/Zpm/comment/list', // 分页获取评论
      sendComment: '/Zpm/comment/comment' // 发表评论
    },
    loginInfo: {
    },
    loaders: {}, // 页面中所有loader对象
    contentRouterViewLoader: 'content-router-view-loader',
    homeRouterViewLoader: 'home-router-view-loader',
    previewLoader: 'preview-loader',
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
    needlessLogin: ['Login', 'Register', 'Forget', 'ActivityPreview', 'ArticleList', 'ArticleView'] // 不需要登录的页面
  }
})

export default store

global.store = store
