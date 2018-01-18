<template>
  <div class="developer_main_content_container">
    <div class="layout-content">
      <transition
        name="file-upload-transition"
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <div class="file_uploader_container" v-if="showFileUploader">
          <upload-file :height="100"></upload-file>
        </div>
      </transition>
      <transition name="content-router-transition"
                  enter-active-class="animated fadeIn"
                  leave-active-class="animated fadeOut"
      >
        <keep-alive>
          <router-view class="content_router_view" :style="{height: showFileUploader ? 'calc(100% - 100px)' : '100%'}" name="ContentRouter"/>
        </keep-alive>
      </transition>
      <loading class="layout-content-loader" :data-ref="contentRouterViewLoader"></loading>
    </div>
  </div>
</template>
<style scoped>
  .developer_main_content_container {
    width: 100%;
    height: 100%;
    background-color: transparent;
  }
  .layout-content {
    position: relative;
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    margin: 20px;
    background-color: #ffffff;
    box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    overflow: hidden;
  }
  .layout-content-loader {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.9);
  }
</style>
<script>
  // import utils from '../../utils'
  import UploadFile from './UploadFile.vue'
  import UploadPlugin from './UploadPlugin.vue'
  import Loading from '../Loading.vue'
  export default {
    name: 'MainContent',
    data () {
      return {
        showFileUploader: false, // 是否显示文件上传控件
//        currentPlugin: '',
//        currentFileName: '',
        contentRouterViewLoader: this.$store.state.contentRouterViewLoader,
        showDefaultContent: true
      }
    },
    computed: {
      loginInfo () {
        return this.$store.state.loginInfo
      },
      allPlugins () {
        return this.$store.state.allPlugins
      }
    },
    components: {
      UploadFile,
      UploadPlugin,
      Loading
    },
    methods: {
      findPluginInfoByName (pluginName) {
        let outPlugin = {}
        let allPlugins = this.allPlugins
        let i = 0
        for (i; i < allPlugins.length; i++) {
          if (allPlugins[i].name === pluginName) {
            outPlugin = allPlugins[i]
            i = allPlugins.length
          }
        }
        return outPlugin
      }
    },
    created () {
//      this.currentPlugin = this.$route.params.pluginName
//      this.currentFileName = this.fileName
      this.$nextTick(() => {
        let pluginInfo = this.findPluginInfoByName(this.$route.params.pluginName)
        this.showFileUploader = (String(pluginInfo.author) === String(this.loginInfo.phonenum))
      })
    },
    watch: {
      '$route': function (value) {
//        this.currentPlugin = value.params.pluginName
//        this.currentFileName = value.params.fileName
        let pluginInfo = this.findPluginInfoByName(this.$route.params.pluginName)
        this.showFileUploader = (String(pluginInfo.author) === String(this.loginInfo.phonenum))
      }
    }
  }
</script>
