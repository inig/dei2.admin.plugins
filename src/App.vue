<template>
  <div id="app">
    <router-view name="HomeRouter" />

    <keep-alive>
      <popup></popup>
    </keep-alive>
  </div>
</template>

<script>
import * as types from './store/mutation-types'
import utils from './utils'
export default {
  name: 'app',
  data () {
    return {
      events: this.$store.state.events,
      eventHub: this.$store.state.eventHub
    }
  },
  mounted () {
    const that = this
    document.onclick = function () {
      that.eventHub.$emit(that.events.bodyClick)
    }
    window.addEventListener('online', () => {
      // if ('serviceWorker' in navigator) {
      //   navigator.serviceWorker.ready.then(reg => {
      //     return reg.sync.register('online')
      //   }).then(res => {
      //   })
      // }
      // this.$Message.success('网络已连接')
      this.$store.commit(types.ONLINE)
    }, false)

    window.addEventListener('offline', () => {
      // if ('serviceWorker' in navigator) {
      //   navigator.serviceWorker.ready.then(reg => {
      //     return reg.sync.register('offline')
      //   }).then(res => {
      //   })
      // }
      // this.$Message.info('网络已断开')
      this.$store.commit(types.OFFLINE)
    }, false)
  },
  computed: {
    loginInfo () {
      return utils.storage.getItem(this.$store.state.localStorageKeys.userInfo)
    },
    fullScreenPopup () {
      return this.$store.state.fullScreenPopup
    }
  },
  components: {
    Popup: () => import('./components/Popup.vue')
  }
}
</script>

<style>
@import "./assets/css/markdown.css";
* {
  margin: 0;
  padding: 0;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-user-select: none;
}

html,
body {
  height: 100%;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  /*min-width: 1000px;*/
  /* min-height: 800px; */
}

#app {
  width: 100%;
  height: 100%;
}

.CodeMirror {
  height: 100% !important;
}

.ivu-select-multiple .ivu-select-item-selected:after {
  margin-top: -5px;
  margin-right: 5px;
}

.noresize textarea {
  resize: none;
}
</style>
