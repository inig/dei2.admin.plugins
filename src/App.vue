<template>
  <div id="app">
    <router-view name="HomeRouter"/>

    <keep-alive>
      <popup></popup>
    </keep-alive>
  </div>
</template>

<script>
  import utils from './utils'
  export default {
    name: 'app',
    data () {
      return {
        events: this.$store.state.events,
        eventHub: this.$store.state.eventHub
      }
    },
    created () {
      const that = this
      document.onclick = function () {
        that.eventHub.$emit(that.events.bodyClick)
      }
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
    /*-webkit-user-select: none;*/
    /*font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;*/
  }

  html, body {
    height: 100%;
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
</style>
