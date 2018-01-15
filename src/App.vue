<template>
  <div id="app">
    <router-view name="HomeRouter"/>
  </div>
</template>

<script>
  import * as types from './store/mutation-types'
  import utils from './utils'
  const io = require('socket.io-client')
  export default {
    name: 'app',
    data () {
      return {
        eventHub: this.$store.state.eventHub,
        events: this.$store.state.events
      }
    },
    computed: {
      loginInfo () {
        return utils.storage.getItem(this.$store.state.localStorageKeys.userInfo)
      }
    },
    created () {
      this.$nextTick(() => {
        const socket = io('http://127.0.0.1:3010', {
          path: '/sk',
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
//        socket.emit('enkel-message', {
//          to: {
//            role: 3,
//            username: 'wq',
//            phonenum: '18000000001'
//          },
//          message: {
//            value: 'Hello ' + Math.random()
//          }
//        })
        socket.on('enkel-message', this.handlerMessage)
      })
    },
    methods: {
      handlerMessage (evt) {
        this.eventHub.$emit(this.events.getNewMessage, evt)
      }
    }
  }
</script>

<style>
  * {
    margin: 0;
    padding: 0;
    outline: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-user-select: none;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  }

  html, body {
    height: 100%;
    min-width: 1000px;
    /* min-height: 800px; */
  }

  #app {
    width: 100%;
    height: 100%;
  }

  .CodeMirror {
    height: 100% !important;
  }
</style>
