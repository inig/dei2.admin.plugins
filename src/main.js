// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import { sync } from 'vuex-router-sync'
import router from './router/index'
import store from './store'
import * as filters from './filters'
import mixins from './mixins'
import iView from 'iview'
import utils from './utils/index'
import ZpmCapture from './assets/js/ZpmCapture'
// import codemirror from 'codemirror/lib/codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/fold/foldgutter.css'
import './assets/css/codemirror/themes/zenburn.css'
import './assets/css/codemirror/themes/dracula.css'
import 'iview/dist/styles/iview.css'
import './assets/css/animate.css/animate.min.css'

// import SharedWorker from './ajax.worker'

sync(store, router)

Vue.use(ZpmCapture)

const VueTouch = require('vue-touch')
Vue.use(VueTouch, {name: 'v-touch'})

Vue.config.productionTip = false

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// register global mixins.
Vue.mixin(mixins)

Vue.use(iView)

// let sharedWorker = new SharedWorker()
// store.state.ajaxSharedWorker = sharedWorker.port
// store.state.ajaxSharedWorker.start()
// store.state.ajaxSharedWorker.postMessage({
//   type: 'ajax',
//   url: 'http://127.0.0.1:3000/Zpm/user/queryUsers',
//   token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoibHMifSwiaWF0IjoxNTE2MjQyOTMzLCJleHAiOjE1MTY4NDc3MzN9.UL6ZX6taU2_cRH7_xK4HRvhsNrD56_fbSlF4F0si9gQ',
//   phonenum: '18000000000',
//   queryUsername: 's'
// })
// store.state.ajaxSharedWorker.onmessage = function (res) {
//   console.log('>====1111111====', res)
// }

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const _state = router.app.$options.store.state
  _state.appHeaderOperationArea = {}
  let _localUserInfo = utils.storage.getItem(_state.localStorageKeys.userInfo)
  if (to.meta && to.meta.title) {
    utils.kit.title(to.meta.title)
  }
  if (to.meta && to.meta.role && to.meta.role.indexOf(_localUserInfo.role) < 0) {
    next({
      replace: true,
      name: 'NotFound'
    })
  } else {
    if (utils.isEmptyObj(_localUserInfo)) {
      if (_state.needlessLogin.indexOf(to.name) === -1) {
        next({
          replace: true,
          name: 'Login'
        })
      }
    } else {
      _state.loginInfo = _localUserInfo
    }
    next()
  }
})

router.afterEach(to => {
  iView.LoadingBar.finish()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
  // template: '<App/>',
  // components: { App }
})
