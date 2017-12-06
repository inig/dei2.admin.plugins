// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import { sync } from 'vuex-router-sync'
import router from './router'
import store from './store'
import * as filters from './filters'
import mixins from './mixins'
import iView from 'iview'
import utils from './utils/index'
import 'iview/dist/styles/iview.css'
import './assets/css/animate.css/animate.min.css'

sync(store, router)

Vue.config.productionTip = false

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// register global mixins.
Vue.mixin(mixins)

Vue.use(iView)

router.beforeEach((to, from, next) => {
  const _state = router.app.$options.store.state
  let _localUserInfo = utils.storage.getItem(_state.localStorageKeys.userInfo)
  if (utils.isEmptyObj(_localUserInfo)) {
    if (to.name !== 'Login') {
      router.push('/login')
    }
  } else {
    if ((new Date()).getTime() - _localUserInfo.loginDate > _state.loginInfo.expireTime) {
      // 登录信息已经过期，需要重新登录
      if (to.name !== 'Login') {
        router.app.$Message.info('登录信息已经过期，请重新登录')
        router.push('/login')
      }
    } else {
      if (_state.needlessLogin.indexOf(to.name) > -1) {
        router.push('/')
      }
    }
  }
  next()
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
