<template>
  <div class="container">
    <div class="tree_container">
      <div class="component_author">
        作者: {{isMyComponent ? '你' : '【' + (componentAuthor.nickname || componentAuthor.phonenum || '') + '】'}}
        <transition name="operation-transition"
                    enter-active-class="animated fadeIn faster"
                    leave-active-class="animated fadeOut faster">
          <div class="file_operation"
               v-if="fileContent && isMyComponent">
            <Tooltip content="文件对比"
                     placement="bottom-end">
              <div class="operation_item"
                   @click="toggleDiffContainer">
                <Icon type="md-filing"
                      size="20" />
              </div>
            </Tooltip>
          </div>
        </transition>
      </div>
      <Tree :data="trees"
            :render="renderContent"></Tree>
    </div>
    <div class="file_content">
      <div class="empty_container"
           v-if="!fileContent">点击左边文件列表，预览文件</div>
      <split-pane :ref="splitPane"
                  :style="{height: '100%', width: '100%'}"
                  :min="30"
                  :max="70"
                  direction="horizontal"
                  v-model="triggerOffset">
        <div class="code_container"
             slot="left">
          <pre class="code_preview"
               :ref="codeContainerRef"></pre>
        </div>
        <div slot="trigger"
             v-if="showMarkDown"
             :style="{left: triggerOffset + '%'}"
             @mousedown="handleMousedown"
             class="split_pane_custom_trigger"></div>
        <div class="markdown_preview markdown-body"
             slot="right"
             v-if="showMarkDown"
             v-html="markdownContent"></div>
      </split-pane>
      <transition name="diff-container-transition"
                  enter-active-class="animated fadeIn faster"
                  leave-active-class="animated fadeOut faster">
        <div class="file_diff_container"
             v-if="showDiff">
          <diff :left="fileContent"
                :right="editor.doc ? editor.doc.getValue() : ''"></diff>
        </div>
      </transition>
    </div>
  </div>
</template>
<style scoped lang="less">
  @import "../../../assets/css/index.less";
  @import "../../../assets/css/markdown.css";
  .container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }
  .tree_container {
    position: absolute;
    left: 0;
    top: 0;
    width: 200px;
    height: 100%;
    padding: 0 15px 15px 15px;
    box-sizing: border-box;
    overflow: auto;
  }
  .component_author {
    position: sticky;
    left: 0;
    top: 0;
    z-index: 1;
    width: 100%;
    height: 32px;
    color: @primary-color;
    background-color: #ffffff;
    border-bottom: 1px solid #f8f8f8;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }
  .file_content {
    position: relative;
    width: calc(~"100% - 200px");
    height: 100%;
    padding: 15px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .empty_container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    color: #c8c8c8;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .code_container {
    height: 100%;
  }
  .code_preview {
    height: 100%;
  }

  .file_operation {
    position: absolute;
    // width: 100px;
    height: 32px;
    right: 0;
    top: 0;
    z-index: 998;
    box-sizing: border-box;
    background-color: transparent;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }
  .operation_item {
    width: 32px;
    height: 32px;
    cursor: pointer;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .operation_item:hover {
    opacity: 0.7;
  }
  .operation_item i {
    color: @primary-color;
  }

  .file_diff_container {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
  }
</style>
<script>
  import * as types from '../../../store/mutation-types'
  import SplitPane from '../../SplitPane.vue'
  import Diff from '../../Diff.vue'
  import marked from 'marked'
  export default {
    name: 'ComponentDetail',
    components: {
      SplitPane,
      Diff
    },
    data () {
      return {
        fileTree: {},
        trees: [],
        selectedFile: '',
        triggerOffset: 50,
        codeContainerRef: 'code-container-ref',
        markdownContent: '',
        showMarkDown: false,
        previewMarkDownFile: false,
        splitPane: 'split-pane',
        componentInfo: {},
        componentAuthor: {},
        fileContent: '',
        isMyComponent: false,
        editor: {},
        configs: {
          common: {
            theme: 'zenburn',
            lineNumbers: true,
            lineWrapping: true,
            styleActiveLine: true,
            foldGutter: true,
            matchBrackets: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
            matchTags: { bothTags: true },
            keyMap: 'sublime'
          },
          myComponent: {
            autoCloseTags: true,
            autoCloseBrackets: true,
            readOnly: false
          },
          otherComponent: {
            readOnly: true
          },
          componentVue: {
            mode: 'vue'
          },
          componentJson: {
            mode: 'application/json'
          },
          componentMd: {
            mode: 'markdown'
          }
        },
        platform: 'windows',
        showDiff: false
      }
    },
    computed: {
      loginInfo () {
        return this.$store.state.loginInfo
      },
      requestInfo () {
        return this.$store.state.requestInfo
      }
    },
    async created () {
      const that = this
      await this.init()
      this.$nextTick(() => {
        let isMac = (navigator.platform === 'Mac68K') || (navigator.platform === 'MacPPC') || (navigator.platform === 'Macintosh') || (navigator.platform === 'MacIntel')
        isMac && (this.platform = 'mac')
        window.onkeydown = function (ev) {
          if (that.$route.name === 'ComponentDetail') {
            if (that.platform === 'mac') {
              if (ev.metaKey && ev.shiftKey && ev.keyCode === 83) {
                // mac下 command + shift + s
                that.save()
              } else if (ev.metaKey && ev.keyCode === 83) {
                // mac下 command + s
                that.save()
                ev.preventDefault()
                return false
              } else if (ev.metaKey && ev.shiftKey && ev.keyCode === 80) {
                // 预览 command + shift + p
                // that.togglePreview()
              } else if (ev.metaKey && ev.keyCode === 80) {
                // 预览 command + p
                // that.togglePreview()
                ev.preventDefault()
                return false
              } else if (ev.metaKey && ev.shiftKey && ev.keyCode === 69) {
                // 编辑文章 command + shift + e
                // that.togglePreview()
              } else if (ev.metaKey && ev.keyCode === 69) {
                // 编辑文章 command + e
                // that.togglePreview()
                ev.preventDefault()
                return false
              }
            } else {
              if (ev.ctrlKey && ev.shiftKey && ev.keyCode === 83) {
                // windows下  control + shift + s 保存
                that.save()
              } else if (ev.ctrlKey && ev.keyCode === 83) {
                // windows下  control + shift + s 保存
                that.save()
                ev.preventDefault()
                return false
              } else if (ev.ctrlKey && ev.shiftKey && ev.keyCode === 38) {
                // 预览 command + shift + p
                // that.togglePreview()
              } else if (ev.ctrlKey && ev.keyCode === 38) {
                // 预览 command + shift + p
                // that.togglePreview()
                ev.preventDefault()
                return false
              } else if (ev.ctrlKey && ev.shiftKey && ev.keyCode === 40) {
                // 编辑文章 command + shift + e
                // that.togglePreview()
              } else if (ev.ctrlKey && ev.keyCode === 40) {
                // 编辑文章 command + shift + e
                // that.togglePreview()
                ev.preventDefault()
                return false
              }
            }
          }
        }
      })
    },
    methods: {
      async init () {
        this.resetData()
        this.hideDiffContainer()
        await this.lsDirectory().catch(err => {
          this.$Notice.error({
            desc: err.message
          })
        })
        this.formatTrees()
        document.title = this.fileTree.name + '详情'
      },
      toggleDiffContainer () {
        this.showDiff = !this.showDiff
      },
      hideDiffContainer () {
        this.showDiff = false
      },
      resetData () {
        this.componentAuthor = {}
        this.componentInfo = {}
        this.editor = {}
        this.fileContent = ''
        this.selectedFile = ''
        let ele = this.$refs[this.codeContainerRef]
        if (ele) {
          ele.innerHTML = ''
        }
      },
      beautifyCode () {
        const that = this
        let componentInfo = this.componentInfo
        let mode = ''
        let fileSuffix = this.selectedFile.replace(/^.+\.(.+)$/, '$1').toLowerCase()
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
          case 'ts':
            mode = 'text/typescript'
            break
          default:
            mode = 'text/javascript'
            break
        }
        let configs = Object.assign({}, this.configs.common, (this.isMyComponent ? this.configs.myComponent : this.configs.otherComponent), {
          mode: mode
        })
        let ele = this.$refs[this.codeContainerRef]
        if (ele) {
          ele.innerHTML = ''
        }
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
            let fileSuffix = that.selectedFile.replace(/^.+\.(.+)$/, '$1').toLowerCase()
            if (fileSuffix === 'md') {
              that.markdownContent = marked(evt.doc.getValue())
            }
          })
        })
      },
      previewMarkDown () {
        this.previewMarkDownFile = !this.previewMarkDownFile
      },
      handleMousedown (e) {
        this.$refs[this.splitPane].handleMousedown(e)
      },
      findName (key, root) {
        let out = []
        let i = 0
        for (i; i < root.length; i++) {
          if (root[i].nodeKey === Number(key)) {
            out.push(root[i].node.name)
            if (root[i].parent !== 0) {
              let _o = this.findName(root[i].parent, root)
              out = out.concat(_o)
            } else {
              out.push(this.fileTree.name)
              i = root.length
            }
          }
        }
        return out.reverse().join('/')
      },
      renderContent (h, { root, node, data }) {
        return h('span', {
          style: {
            display: 'inline-block',
            width: '100%'
          }
        }, [
            h('span', {
              style: (() => {
                let _flag = (this.selectedFile == this.findName(node.nodeKey, root))
                return {
                  cursor: 'pointer',
                  fontWeight: (data.type === 'directory' ? 'bolder' : '400'),
                  transition: 'all .1s ease',
                  color: _flag ? 'rgba(10, 81, 15, 1)' : '',
                  fontSize: _flag ? '15px' : '13px'
                }
              })(),
              on: {
                click: async () => {
                  if (data.type === 'file') {
                    if (this.editor && this.editor.doc && (this.editor.doc.getValue() !== this.fileContent)) {
                      this.$Modal.confirm({
                        title: '提醒',
                        content: `文件${this.selectedFile.split('/').pop()}内容有变化，是否保存?`,
                        okText: '直接保存',
                        cancelText: '再想想',
                        onOk: () => {
                          this.save()
                        }
                      })
                    } else {
                      this.hideDiffContainer()
                      this.selectedFile = this.findName(node.nodeKey, root)
                      await this.getFileContent(this.selectedFile)
                    }
                  } else if (data.type === 'directory') {
                    if (!data.hasOwnProperty('expand')) {
                      data.expand = false
                    }
                    data.expand = !data.expand
                  }
                }
              }
            }, [
                h('Icon', {
                  props: {
                    size: '14',
                    type: data.type === 'directory' ? (data.expand ? 'ios-folder-open' : 'ios-folder') : 'ios-paper'
                  },
                  style: {
                    marginRight: '8px'
                  }
                }),
                h('span', data.name)
              ])
          ]);
      },
      formatChildren (target) {
        let i = 0
        for (i; i < target.length; i++) {
          target[i].expand = true
          if (target[i].children && target[i].children.length > 0) {
            this.formatChildren(target[i].children)
          }
        }
      },
      formatTrees () {
        let outTree = []
        let fileTree = JSON.parse(JSON.stringify(this.fileTree))
        let treeObj = {}
        if (Object.keys(fileTree).length > 0) {
          this.formatChildren(fileTree.children)
          treeObj = {
            name: fileTree.name,
            type: fileTree.type,
            expand: true,
            children: fileTree.children
          }
          treeObj.render = (h, { root, node, data }) => {
            return h('span', {
              style: {
                display: 'inline-block',
                width: '100%'
              }
            }, [
                h('span', {
                  style: {
                    cursor: 'pointer',
                    fontWeight: (data.type === 'directory' ? 'bolder' : '400')
                  },
                  on: {
                    click: () => {
                      if (data.type === 'directory') {
                        if (!data.hasOwnProperty('expand')) {
                          data.expand = false
                        }
                        data.expand = !data.expand
                      }
                    }
                  }
                }, [
                    h('Icon', {
                      props: {
                        size: '14',
                        type: (data.expand ? 'ios-folder-open' : 'ios-folder')
                      },
                      style: {
                        marginRight: '8px'
                      }
                    }),
                    h('span', data.name)
                  ])
              ])
          }
        }
        outTree.push(treeObj)
        this.trees = outTree
      },
      lsDirectory () {
        return new Promise(async (resolve, reject) => {
          let ajaxData = await this.$store.dispatch(types.AJAX, {
            url: this.requestInfo.component.ls,
            method: 'POST',
            data: {
              uuid: this.$route.params.uuid
            }
          })
          if (ajaxData.status === 200) {
            this.fileTree = ajaxData.data.files
            this.componentAuthor = ajaxData.data.author
            this.isMyComponent = (String(this.componentAuthor.phonenum) === String(this.loginInfo.phonenum))
            resolve(ajaxData.data)
          } else {
            this.fileTree = {}
            this.componentAuthor = {}
            this.isMyComponent = false
            reject(new Error(ajaxData.message || '失败'))
          }
        })
      },
      getFileContent (filename) {
        return new Promise(async (resolve, reject) => {
          let ajaxData = await this.$store.dispatch(types.AJAX, {
            url: this.requestInfo.component.content,
            method: 'POST',
            data: {
              path: filename,
              uuid: this.$route.params.uuid
            }
          })
          if (ajaxData.status === 200) {
            if (ajaxData.data.filename === filename) {
              this.fileContent = ajaxData.data.content
              this.componentInfo = ajaxData.data.componentInfo
              let fileSuffix = this.selectedFile.replace(/^.+\.(.+)$/, '$1').toLowerCase()
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
            this.beautifyCode()
            resolve(true)
          } else {
            reject(new Error(ajaxData.message))
          }
        })
      },
      save () {
        return new Promise(async (resolve, reject) => {
          if (this.editor.doc.getValue() !== this.fileContent) {
            // 文章内容有变化
            let ajaxData = await this.$store.dispatch(types.AJAX, {
              url: this.requestInfo.component.update,
              method: 'POST',
              data: {
                path: this.selectedFile,
                uuid: this.$route.params.uuid,
                content: this.editor.doc.getValue()
              }
            })
            if (ajaxData.status === 200) {
              this.fileContent = this.editor.doc.getValue()
              this.$Notice.success({
                title: this.selectedFile.split('/').pop() + '保存成功'
              })
              resolve(true)
            } else {
              this.$Notice.error({
                title: ajaxData.message
              })
              reject(new Error(ajaxData.message))
            }
          }
        })
      }
    },
    watch: {
      async '$route' (val) {
        if (val.name === 'ComponentDetail') {
          await this.init()
        }
      }
    }
  }
</script>
