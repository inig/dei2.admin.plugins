import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import NotFound from '../components/404.vue'
import Plugins from '../components/Plugins.vue'
import Plugin from '../components/Plugin.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      components: {
        HomeRouter: Home
      }
    },
    {
      path: '/login',
      name: 'Login',
      components: {
        HomeRouter: Login
      }
    },
    {
      path: '/plugins',
      name: 'Plugins',
      components: {
        ContentRouter: Plugins
      },
      children: [
        {
          path: '/:pluginName',
          name: 'Plugin',
          components: {
            ContentRouter: Plugin
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
