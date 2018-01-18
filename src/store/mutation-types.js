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

// >>>> actions:

// 登录
export const LOGIN = 'LOGIN'

// 注册
export const REGISTER = 'REGISTER'

// 修改密码
export const MODIFY_PASSWORD = 'MODIFY_PASSWORD'

// 获取插件列表
export const LIST_PLUGINS = 'LIST_PLUGINS'

// 查询用户列表
export const LIST_USERS = 'LIST_USERS'

// 插件列表，用于root、admin插件管理
export const LIST_ALL_PLUGINS = 'LIST_ALL_PLUGINS'

// 更改用户设置
export const UPDATE_USER_SETTINGS = 'UPDATE_USER_SETTINGS'

// 修改插件的状态（审核插件）
export const UPDATE_PLUGIN_SETTINGS = 'UPDATE_PLUGIN_SETTINGS'

// 删除用户
export const DELETE_USER = 'DELETE_USER'

// 删除插件
export const DELETE_PLUGIN = 'DELETE_PLUGIN'

// 预览文件内容
export const VIEW_FILE = 'VIEW_FILE'

// 更新插件某文件内容
export const UPDATE_PLUGIN_FILE_CONTENT = 'UPDATE_PLUGIN_FILE_CONTENT'

// 更新用户信息
export const UPDATE_USER_INFO = 'UPDATE_USER_INFO'

// 获取用户信息
export const GET_USER_INFO = 'GET_USER_INFO'

// 发送消息
export const SEND_MESSAGE = 'SEND_MESSAGE'

// 保存消息
export const SAVE_MESSAGE = 'SAVE_MESSAGE'

// 消息置为已读
export const READ_MESSAGE = 'READ_MESSAGE'

// 查询用户列表，模糊查询。不需要管理员权限
export const QUERY_USERS = 'QUERY_USERS'

// 查询消息列表，不需要权限
export const QUERY_MESSAGE = 'QUERY_MESSAGE'

// 更新用户的登录信息
export const UPDATE_LOGIN_INFO = 'UPDATE_LOGIN_INFO'

// 断开socket.io连接
export const DISCONNECT_SOCKETIO = 'DISCONNECT_SOCKETIO'

// 更新用户头像
export const UPDATE_AVATAR = 'UPDATE_AVATAR'
