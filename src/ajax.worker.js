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
 * Created by liangshan on 2018/1/18.
 */
const querystring = require('querystring')
let ajax = {
  instance: (function (self) {
    if (self.instance) {
      return self.instance
    }
    let HttpRequest = null
    if (XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
      HttpRequest = new XMLHttpRequest()
    } else if (ActiveXObject) { // IE 6 and older
      HttpRequest = new ActiveXObject('Microsoft.XMLHTTP')
    }
    return HttpRequest
  })(this),
  get: function (url, fn) {
    let instance = this.instance
    instance.open('GET', url, true)
    instance.onreadystatechange = function () {
      if (Number(instance.readyState) === 4 && (Number(instance.status) === 200 || Number(instance.status) === 304)) {
        fn.call(this, JSON.parse(instance.responseText))
      }
    }
    instance.send()
  },
  post: function (url, data, fn) {
    let instance = this.instance
    instance.open('POST', url, true)
    instance.setRequestHeader('Content-Type', 'application/json')
    instance.onreadystatechange = function () {
      if (Number(instance.readyState) === 4 && (Number(instance.status) === 200 || Number(instance.status) === 304)) {
        fn.call(this, JSON.parse(instance.responseText))
      }
    }
    instance.send(querystring.stringify(data))
  }
}

self.onconnect = function (e) {
  let port = e.ports[0]
  port.onmessage = function (evt) {
    console.log('=======', evt)
    let type = ''
    let url = ''
    let params = JSON.parse(JSON.stringify(evt.data))
    if (params.type) {
      type = params.type
      delete params.type
    }
    if (params.url) {
      url = params.url
      delete params.url
    }
    if (url !== '') {
      if (type === 'ajax') {
        for (let i = 0; i < 10; i++) {
          ajax.post(url, params, function (res) {
            port.postMessage(res)
          })
        }
      }
    }
  }
  port.start()
}
