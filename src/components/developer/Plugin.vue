<template>
    <div class="plugin_container">
      <div class="plugin_container_header">
        <div class="plugin_operation_container">
          <a :href="'https://static.dei2.com/plugins/' + currentPlugin + '/' + currentFileName" class="operation_item">
              <Tooltip content="下载文件" placement="bottom" :transfer="true">
                  <Icon type="arrow-down-a" class="operation_item_icon" :class="['operation_item_icon_enable_' + enableDownload]" size="18"></Icon>
              </Tooltip>
          </a>
          <div class="operation_item" @click="saveFile" v-if="isMyPlugin">
              <Tooltip content="保存文件" placement="bottom" :transfer="true">
                  <Icon type="arrow-up-a" class="operation_item_icon" :class="['operation_item_icon_enable_' + enableSave]" size="18"></Icon>
              </Tooltip>
          </div>
          <div class="operation_item" @click="previewMarkDown" v-if="showMarkDown">
              <Tooltip :content="previewMarkDownFile ? '关闭预览' : '预览文件'" placement="bottom" :transfer="true">
                  <Icon :type="previewMarkDownFile ? 'eye-disabled' : 'eye'" class="operation_item_icon" :class="['operation_item_icon_enable_' + enableSave]" size="18"></Icon>
              </Tooltip>
          </div>
        </div>
      </div>
      <div class="plugin_content_container" :style="{height: 'calc(100% - 44px)'}">
        <split-pane :ref="splitPane" :style="{height: '100%', width: '100%'}" :min="30" :max="70" direction="horizontal" v-model="triggerOffset">
          <div class="code_container" slot="left">
            <!-- <div class="plugin_operation_container" :class="['plugin_operation_container_' + showMarkDown]">
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
                    <Tooltip :content="previewMarkDownFile ? '关闭预览' : '预览md文件'" placement="bottom">
                        <Icon :type="previewMarkDownFile ? 'eye-disabled' : 'eye'" class="operation_item_icon" :class="['operation_item_icon_enable_' + enableSave]" size="18"></Icon>
                    </Tooltip>
                </div>
            </div> -->
            <pre class="code_preview" :ref="codeContainerRef"></pre>
          </div>
          <div slot="trigger" v-if="showMarkDown" :style="{left: triggerOffset + '%'}" @mousedown="handleMousedown" class="split_pane_custom_trigger"></div>
          <div class="markdown_preview markdown-body" slot="right" v-if="showMarkDown" v-html="markdownContent"></div>
        </split-pane>
        <transition
          name="preview-transition"
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut">
          <div class="markdown_preview_full markdown-body" v-if="previewMarkDownFile" v-html="markdownContent"></div>
        </transition>
      </div>
    </div>
</template>
<style>
  @import "../../assets/css/markdown.css";
  .plugin_container {
    width: 100%;
    font-size: 14px;
    box-sizing: border-box;
    overflow: hidden;
  }
  .plugin_container_header {
    box-sizing: border-box;
    padding: 5px 10px;
    background-color: #fafbfc;
    border: 1px solid #e1e4e8;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
  }
  .plugin_operation_container {
    width: 100%;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    background-color: transparent;
  }
  .operation_item {
    width: 27px;
    height: 32px;
    margin-left: 5px;
    padding-top: 8px;
    display: inline-flex;
    justify-content: center;
  }
  .operation_item_icon {
    color: #586069;
  }
  .operation_item_icon:hover {
    color: #0366d6;
    cursor: pointer;
  }
  /* .operation_item_icon_enable_false {
    opacity: 0.05;
  }
  .operation_item_icon_enable_true {
    opacity: 0.4;
  }
  .operation_item_icon_enable_false:hover {
    cursor: not-allowed;
  } */
  .plugin_content_container {
    position: relative;
    height: 100%;
    width: 100%;
  }
  .code_container {
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
    padding: 20px;
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
  .markdown_preview_full {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 20px;
    overflow: auto;
    background-color: #fff;
    z-index: 998;
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
        previewMarkDownFile: false,
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
        this.previewMarkDownFile = !this.previewMarkDownFile
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
              this.previewMarkDownFile = false
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
