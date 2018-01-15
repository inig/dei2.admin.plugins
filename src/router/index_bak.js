import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import NotFound from '../components/404.vue'
import Plugins from '../components/developer/Plugins.vue'
import Plugin from '../components/developer/Plugin.vue'
import MainContent from '../components/developer/MainContent.vue'
import Register from '../components/Register.vue'
import PersonalCenter from '../components/developer/PersonalCenter.vue'

import Home from '../components/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      components: {
        HomeRouter: Login
      }
    },
    {
      path: '/register',
      name: 'Register',
      components: {
        HomeRouter: Register
      }
    },
    {
      path: '/',
      name: 'Home',
      components: {
        HomeRouter: Home
      },
      children: [
        {
          path: 'plugins',
          name: 'Plugins',
          components: {
            ContentRouter: Plugins
          }
        },
        {
          path: 'plugin/:pluginName/:fileName',
          name: 'Plugin',
          components: {
            ContentRouter: Plugin
          }
        },
        {
          path: '/personal',
          name: 'Personal',
          components: {
            ContentRouter: PersonalCenter
          }
        },
        {
          path: '',
          components: {
            ContentRouter: MainContent
          }
        },
        {
          path: '*',
          name: 'NotFound',
          components: {
            ContentRouter: NotFound
          }
        }
      ]
    },
    {
      path: '*',
      name: 'NotFound',
      components: {
        HomeRouter: NotFound
      }
    }
  ]
})
