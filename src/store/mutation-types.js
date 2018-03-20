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

// >>>> mutations:
export const SHOW_POPUP = 'SHOW_POPUP'

// 保存所有插件
export const SET_ALL_PLUGINS = 'SET_ALL_PLUGINS'

// 挂载loader
export const SET_LOADER = 'SET_LOADER'

// 卸载loader
export const DEL_LOADER = 'DEL_LOADER'

// 挂载socket
export const SET_SOCKET = 'SET_SOCKET'

// 展开或收起左边菜单
export const TOGGLE_MENU = 'TOGGLE_MENU'

// 折叠侧边栏菜单
export const FOLD_SIDE_MENU = 'FOLD_SIDE_MENU'

// 窗口全屏
export const TOGGLE_FULL_SCREEN = 'TOGGLE_FULL_SCREEN'

// 设置simulator属性
export const SET_SIMULATOR = 'SET_SIMULATOR'

// 激活组件
export const ACTIVE_COMPONENT = 'ACTIVE_COMPONENT'

// 保存活动模板数据至本地store，非数据库
export const SAVE_LOCAL_TEMPLATE = 'SAVE_LOCAL_TEMPLATE'

// 初始化活动模板数据
export const INIT_LOCAL_TEMPLATE = 'INIT_LOCAL_TEMPLATE'

// >>>> actions:

// 登录1
export const LOGIN = 'LOGIN'

// 注册1
export const REGISTER = 'REGISTER'

// 修改密码1
export const MODIFY_PASSWORD = 'MODIFY_PASSWORD'

// 更新用户信息1
export const UPDATE_USER_INFO = 'UPDATE_USER_INFO'

// 获取用户信息1
export const GET_USER_INFO = 'GET_USER_INFO'

// 发送消息1
export const SEND_MESSAGE = 'SEND_MESSAGE'

// 保存消息1
export const SAVE_MESSAGE = 'SAVE_MESSAGE'

// 更新用户的登录信息
export const UPDATE_LOGIN_INFO = 'UPDATE_LOGIN_INFO'

// 断开socket.io连接
export const DISCONNECT_SOCKETIO = 'DISCONNECT_SOCKETIO'

// 更新用户头像
export const UPDATE_AVATAR = 'UPDATE_AVATAR'

// 查询消息的总条数
export const COUNT_MESSAGE = 'COUNT_MESSAGE'

// AJAX请求，=> Promise1
export const AJAX = 'AJAX'
