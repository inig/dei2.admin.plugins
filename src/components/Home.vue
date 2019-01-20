<template>
  <component :is="currentHome"></component>
</template>
<style>
</style>
<script>
// import utils from '../utils'
import * as types from '../store/mutation-types'
const io = require('socket.io-client')
export default {
  name: 'Home',
  data () {
    return {
      eventHub: this.$store.state.eventHub,
      events: this.$store.state.events,
      socket: this.$store.state.socket
    }
  },
  computed: {
    loginInfo () {
      return this.$store.state.loginInfo
    },
    currentHome () {
      let _role = this.loginInfo.role
      let _currentHome = ''
      switch (_role) {
        case 1:
          _currentHome = 'RootHome'
          break
        case 2:
          _currentHome = 'AdminHome'
          break
        case 3:
          _currentHome = 'DeveloperHome'
          break
        case 4:
          _currentHome = 'UserHome'
          break
        default:
          break
      }
      return _currentHome
    }
  },
  created () {
    this.$nextTick(() => {
      if (!this.socket.ban) {
        const socket = io(`${this.socket.server}:${this.socket.port}`, {
          path: this.socket.path,
          query: {
            token: this.loginInfo.token,
            username: this.loginInfo.username,
            phonenum: this.loginInfo.phonenum,
            role: this.loginInfo.role
          },
          transports: ['websocket']
        })
        this.$store.commit(types.SET_SOCKET, {
          socket: socket
        })
        socket.on(this.socket.event, this.handlerMessage)
      }
    })
  },
  methods: {
    handlerMessage (evt) {
      this.eventHub.$emit(this.events.getNewMessage, evt)
    }
  },
  components: {
    RootHome: () => import('./root/Home.vue'),
    AdminHome: () => import('./admin/Home.vue'),
    DeveloperHome: () => import('./developer/Home.vue'),
    UserHome: () => import('./user/Home.vue')
  }
}
</script>
