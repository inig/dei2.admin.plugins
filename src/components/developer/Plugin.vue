<template>
    <div class="plugin_container">
      <split-pane :ref="splitPane" :style="{height: '100%', width: '100%'}" :min="30" :max="70" direction="horizontal" v-model="triggerOffset">
        <div class="code_container" slot="left">
          <div class="plugin_operation_container" :class="['plugin_operation_container_' + showMarkDown]">
              <a :href="'https://static.dei2.com/plugins/' + currentPlugin + '/' + currentFileName" class="operation_item">
                  <Tooltip content="下载文件" placement="bottom">
                      <Icon type="arrow-down-a" class="operation_item_icon" :class="['operation_item_icon_enable_' + enableDownload]" size="18"></Icon>
                  </Tooltip>
              </a>
              <div class="operation_item" @click="saveFile" v-if="isMyPlugin">
                  <Tooltip content="保存文件" placement="bottom">
                      <Icon type="arrow-up-a" class="operation_item_icon" :class="['operation_item_icon_enable_' + enableSave]" size="18"></Icon>
                  </Tooltip>
              </div>
              <div class="operation_item" @click="previewMarkDown" v-if="showMarkDown">
                  <Tooltip content="预览md文件" placement="bottom">
                      <Icon type="eye" class="operation_item_icon" :class="['operation_item_icon_enable_' + enableSave]" size="18"></Icon>
                  </Tooltip>
              </div>
          </div>
          <pre class="code_preview" :ref="codeContainerRef"></pre>
        </div>
        <div
          slot="trigger"
          v-if="showMarkDown"
          :style="{left: triggerOffset + '%'}"
          @mousedown="handleMousedown"
          class="split_pane_custom_trigger"></div>
        <div class="markdown_preview markdown-body" slot="right" v-if="showMarkDown" v-html="markdownContent"></div>
      </split-pane>
    </div>
</template>
<style>
  @import "../../assets/css/markdown.css";
  .plugin_container {
    position: relative;
    font-size: 14px;
    box-sizing: border-box;
    overflow: auto;
  }
  .plugin_operation_container {
    position: absolute;
    right: 40px;
    top: 0;
    width: 50px;
    height: 32px;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .plugin_operation_container_true {
    width: 75px;
    background-color: rgba(0, 0, 0, .6);
  }
  .plugin_operation_container_false {
    width: 50px;
    background-color: transparent;
  }
  .operation_item {
    width: 25px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .operation_item_icon {
    color: #ffffff;
  }
  .operation_item_icon_enable_false {
    opacity: 0.05;
  }
  .operation_item_icon_enable_true {
    opacity: 0.4;
  }
  .operation_item_icon_enable_true:hover {
    opacity: 1;
    cursor: pointer;
  }
  .operation_item_icon_enable_false:hover {
    cursor: not-allowed;
  }
  .code_container {
    /* position: relative; */
    text-shadow: none;
    height: 100%;
    overflow: auto;
  }
  .code_preview {
    text-shadow: none;
    height: 100%;
    overflow: auto;
  }
  .markdown_preview {
    height: 100%;
    padding: 10px;
    overflow: auto;
  }
  .CodeMirror {
    height: 100%!important;
  }
  .split_pane_custom_trigger{
    position: absolute;
    width: 10px;
    height: 100%;
    box-sizing: border-box;
    cursor: col-resize;
    background-color: transparent;
  }
</style>
<script>
  import * as types from '../../store/mutation-types'
  import SplitPane from '../SplitPane.vue'
  import marked from 'marked'
  // import utils from '../../utils/index'
  export default {
    name: 'Plugin',
    data () {
      return {
        splitPane: 'split-pane',
        triggerOffset: 50,
        editor: {},
        contentRouterViewLoader: this.$store.state.contentRouterViewLoader,
        codeContainerRef: 'code-container-ref',
        currentPlugin: '',
        currentFileName: '',
        fileContent: '',
        markdownContent: '',
        showMarkDown: false,
        eventHub: this.$store.state.eventHub,
        events: this.$store.state.events,
        requestInfo: this.$store.state.requestInfo,
        enableSave: true,
        enableDownload: true,
        isMyPlugin: false,
        configs: {
          common: {
            theme: 'zenburn',
            lineNumbers: true,
            lineWrapping: true,
            styleActiveLine: true,
            foldGutter: true,
            matchBrackets: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
            matchTags: {bothTags: true},
            keyMap: 'sublime'
          },
          myPlugin: {
            autoCloseTags: true,
            autoCloseBrackets: true,
            readOnly: false
          },
          otherPlugin: {
            readOnly: true
          },
          pluginVue: {
            mode: 'vue'
          },
          pluginJson: {
            mode: 'application/json'
          },
          pluginMd: {
            mode: 'markdown'
          }
        }
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
    async created () {
      this.currentPlugin = this.$route.params.pluginName
      this.currentFileName = this.$route.params.fileName
      this.eventHub.$on(this.events.updatePluginFileContent, await this.updatePluginFileContent)
      await this.updatePluginFileContent({
        plugin: this.currentPlugin,
        filename: this.currentFileName
      })
    },
    watch: {
      '$route': async function (value) {
        this.currentPlugin = value.params.pluginName
        this.currentFileName = value.params.fileName
        await this.updatePluginFileContent({
          plugin: this.currentPlugin,
          filename: this.currentFileName
        })
      }
    },
    methods: {
      previewMarkDown () {

      },
      handleMousedown (e) {
        this.$refs[this.splitPane].handleMousedown(e)
      },
      async getFileContent (args) {
        let fileContent = await this.$store.dispatch(types.AJAX, {
          url: this.requestInfo.viewFile,
          data: {
            plugin: args.plugin,
            filename: args.filename
          }
        })
        return fileContent
      },
      async updatePluginFileContent (args) {
        const that = this
        // that.eventHub.$off(that.events.updatePluginFileContent)
        try {
          let _fileData = await this.getFileContent({
            plugin: args.plugin,
            filename: args.filename
          })
          if (_fileData.data.plugin === args.plugin && _fileData.data.filename === args.filename) {
            this.fileContent = _fileData.data.content
            let fileSuffix = this.currentFileName.replace(/^.+\.(.+)$/, '$1').toLowerCase()
            if (fileSuffix === 'md') {
              this.triggerOffset = 50
              this.showMarkDown = true
              this.markdownContent = marked(this.fileContent)
            } else {
              this.triggerOffset = 100
              this.markdownContent = ''
              this.showMarkDown = false
            }
          }
        } catch (err) {
          this.fileContent = ''
        }
        this.beautifyCode()
        setTimeout(() => {
          that.$store.state.loaders[that.contentRouterViewLoader].hide()
        }, 800)
      },
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
      },
      beautifyCode () {
        const that = this
        let pluginInfo = this.findPluginInfoByName(this.currentPlugin)
        let isMyPlugin = (String(pluginInfo.author) === String(this.loginInfo.phonenum))
        this.isMyPlugin = isMyPlugin
        let mode = ''
        let fileSuffix = this.currentFileName.replace(/^.+\.(.+)$/, '$1').toLowerCase()
        switch (fileSuffix) {
          case 'vue':
            mode = 'vue'
            break
          case 'json':
            mode = 'application/json'
            break
          case 'md':
            mode = 'markdown'
            break
          default:
            break
        }
        let configs = Object.assign({}, this.configs.common, (isMyPlugin ? this.configs.myPlugin : this.configs.otherPlugin), {
          mode: mode
        })
        let ele = this.$refs[this.codeContainerRef]
        ele.innerHTML = ''
        require([
          'codemirror/lib/codemirror',
          'codemirror/mode/vue/vue',
          'codemirror/mode/javascript/javascript',
          'codemirror/mode/markdown/markdown',
          'codemirror/addon/comment/comment',
          'codemirror/addon/fold/foldcode',
          'codemirror/addon/fold/foldgutter',
          'codemirror/addon/fold/markdown-fold',
          'codemirror/addon/fold/xml-fold',
          'codemirror/addon/fold/comment-fold',
          'codemirror/addon/fold/brace-fold',
          'codemirror/addon/edit/closebrackets',
          'codemirror/addon/edit/closetag',
          'codemirror/addon/edit/matchtags',
          'codemirror/keymap/sublime'
        ], function (CodeMirror) {
          that.editor = CodeMirror(ele, Object.assign({
            value: that.fileContent
          }, configs))
          that.editor.on('change', function (evt) {
            let fileSuffix = that.currentFileName.replace(/^.+\.(.+)$/, '$1').toLowerCase()
            if (fileSuffix === 'md') {
              that.markdownContent = marked(evt.doc.getValue())
            }
          })
        })
      },
      async saveFile () {
        let _newFileContent = this.editor.doc.getValue()
        try {
          let updateFileContent = await this.$store.dispatch(types.AJAX, {
            url: this.requestInfo.updatePluginFileContent,
            data: {
              plugin: this.currentPlugin,
              filename: this.currentFileName,
              content: _newFileContent
            }
          })
          if (Number(updateFileContent.status) === 200) {
            this.$Message.success(updateFileContent.message)
          } else {
            this.$Message.error(updateFileContent.message)
            if (updateFileContent.data.needLogin) {
              this.$router.replace('/login')
            }
          }
        } catch (err) {
          this.$Message.error(err)
        }
      }
    },
    components: {
      SplitPane
    }
  }
</script>
