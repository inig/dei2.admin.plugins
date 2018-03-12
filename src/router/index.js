import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

// export const routerHome = {
//   path: '/',
//   name: 'home',
//   meta: {
//     title: '后台管理'
//   },
//   components: {
//     HomeRouter: () => import('../components/Home.vue')
//   }
// }

export const routerLogin = {
  path: '/login',
  name: 'Login',
  meta: {
    title: '登录'
  },
  components: {
    HomeRouter: () => import('../components/Login.vue')
  }
}

export const routerRegister = {
  path: '/register',
  name: 'Register',
  meta: {
    title: '注册'
  },
  components: {
    HomeRouter: () => import('../components/Register.vue')
  }
}

// export const routerLocking = {
//   path: '/locking',
//   name: 'locking',
//   components: {
//     HomeRouter: () => import('../components/lockscreen/components/locking-page.vue')
//   }
// }

export const contentRouter = {
  path: '/',
  name: 'Home',
  meta: {
    title: '后台管理系统'
  },
  components: {
    HomeRouter: () => import('../components/Home.vue')
  },
  children: [
    {
      path: '/plugin',
      redirect: '/'
    },
    {
      path: '/plugin/:pluginName',
      redirect: '/'
    },
    {
      path: '/plugin/:pluginName/:fileName',
      name: 'Plugin',
      meta: {
        title: '用户插件'
      },
      components: {
        ContentRouter: () => import('../components/developer/Plugin.vue')
      }
    },
    {
      path: '/personal',
      name: 'Personal',
      meta: {
        title: '个人中心'
      },
      components: {
        ContentRouter: () => import('../components/developer/PersonalCenter.vue')
      }
    },
    {
      path: '/users/index',
      name: 'UsersIndex',
      meta: {
        role: [1],
        title: '用户列表'
      },
      components: {
        ContentRouter: () => import('../components/root/Users.vue')
      }
    },
    {
      path: '/plugins/index',
      name: 'PluginsIndex',
      meta: {
        role: [1, 2],
        title: '插件管理'
      },
      components: {
        ContentRouter: () => import('../components/admin/Plugins.vue')
      }
    },
    {
      path: '/activity/index',
      name: 'ActivityIndex',
      meta: {
        role: [4],
        title: '活动管理'
      },
      components: {
        ContentRouter: () => import('../components/user/Activity.vue')
      }
    },
    {
      path: '/activity/edit',
      name: 'ActivityEdit',
      meta: {
        role: [4],
        title: '活动编辑'
      },
      components: {
        ContentRouter: () => import('../components/user/components/ActivityEdit.vue')
      }
    },
    {
      path: '/message',
      name: 'Message',
      meta: {
        role: [1, 2, 3],
        title: '消息管理'
      },
      components: {
        ContentRouter: () => import('../components/AppMessage.vue')
      }
    }
  ]
}

export const page404 = {
  path: '/*',
  name: 'NotFound',
  meta: {
    title: '页面丢了'
  },
  components: {
    HomeRouter: () => import('../components/404.vue')
  }
}

export default new Router({
  mode: 'history',
  routes: [
    // routerHome,
    routerLogin,
    routerRegister,
    // routerLocking,
    contentRouter,
    page404
  ]
})
