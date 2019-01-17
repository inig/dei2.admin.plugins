<template>
  <div class="activity_edit_container">
    <div class="editor_components_container"
         :class="{'shown': editorComponentsContainerShown}">
      <div class="editor_components_container_header">
        <div class="editor_components_toggle_container">
          <div class="editor_components_toggle"
               @click="toggleEditorComponentsContainer">
            <Icon type="chevron-right"
                  size="20"
                  style="color: #888;"></Icon>
          </div>
        </div>
      </div>
      <div class="editor_components_container_body">
        <editor-component :shown="editorComponentsContainerShown"></editor-component>
      </div>
    </div>
    <div class="editor_main_container"
         :ref="editorMainContainerRef"
         tabindex="10"
         com-type="activity">
      <div class="editor_main_simulator_selector">
        <Select v-model="selectedSimulatorIndex"
                size="small"
                style="width: 120px"
                @on-change="setSimulatorProperty">
          <Option v-for="(item, index) in simulators"
                  :value="index"
                  :key="item.name">{{ item.name }}</Option>
        </Select>
        <p class="simulator_size"
           tabindex="9">
          <span>{{simulators[selectedSimulatorIndex].width}}</span>x<span>{{simulators[selectedSimulatorIndex].height}}</span>
        </p>
        <p class="simulator_size">
          <Select v-model="simulatorScale.value"
                  size="small"
                  filterable
                  style="width: 80px"
                  @on-change="setSimulatorProperty">
            <Option v-for="(item, index) in simulatorScale.options"
                    :value="index"
                    :key="item.value">{{ item.value * 100 }}%</Option>
          </Select>
        </p>
        <!--<Tooltip :content="platform === 'mac' ? '按Command+Shift+S保存活动模板' : '按Control+Shift+S保存模板'" placement="bottom-end" style="position: absolute; right: 15px;">-->
        <!--<Button type="primary" :loading="isSaving" icon="paper-airplane" size="small" @click="saveActivity">-->
        <!--<span v-if="!isSaving">保存模板</span>-->
        <!--<span v-else>保存中...</span>-->
        <!--</Button>-->
        <!--</Tooltip>-->
      </div>
      <div class="editor_main_simulator"
           tabindex="10"
           :style="{transform: 'scale(' + parseFloat(1 / simulators[selectedSimulatorIndex].dpr) + ')'}">
        <editor-simulator></editor-simulator>
        <div class="editor_simulator_operation_container"
             :style="{transform: 'scale(' + parseFloat(simulators[selectedSimulatorIndex].dpr) + ')'}">
          <div class="editor_simulator_operation_item editor_simulator_operation_item_normal"
               :class="{'disabled': currentPageIndex === 0}"
               @click="prevPage">
            <Tooltip content="上一页"
                     placement="right"
                     v-if="currentPageIndex !== 0">
              <Icon type="arrow-up-a"
                    size="24"></Icon>
            </Tooltip>
            <Icon type="arrow-up-a"
                  size="24"
                  v-else></Icon>
          </div>
          <div class="editor_simulator_operation_item editor_simulator_operation_item_delete"
               :class="{'disabled': pageData.length < 2}"
               @click="removePage">
            <Tooltip content="删除当前页"
                     placement="right"
                     v-if="pageData.length > 1">
              <Icon type="trash-b"
                    size="24"></Icon>
            </Tooltip>
            <Icon type="trash-b"
                  size="24"
                  v-else></Icon>
          </div>
          <div class="editor_simulator_operation_item editor_simulator_operation_item_add"
               @click="addPage">
            <Tooltip content="新增一页"
                     placement="right">
              <Icon type="plus-round"
                    size="24"></Icon>
            </Tooltip>
          </div>
          <div class="page_count">
            <p class="page_count_current"
               :ref="currentPageRef"
               v-text="currentPageIndex + 1"></p>
            <!--<input class="page_count_current" type="number" :min="1" :max="pageData.length" :number="true" :value="currentPageIndex + 1"/>-->
            <p>/</p>
            <p class="page_count_total"
               v-text="pageData.length"></p>
          </div>
          <div class="editor_simulator_operation_item editor_simulator_operation_item_normal"
               :class="{'disabled': currentPageIndex === pageData.length - 1}"
               @click="nextPage">
            <Tooltip content="下一页"
                     placement="right"
                     v-if="currentPageIndex < (pageData.length - 1)">
              <Icon type="arrow-down-a"
                    size="24"></Icon>
            </Tooltip>
            <Icon type="arrow-down-a"
                  size="24"
                  v-else></Icon>
          </div>
          <div class="editor_simulator_operation_item editor_simulator_operation_item_normal"
               @click="toggleGrid">
            <Tooltip :content="grid.shown ? '关闭网格' : '预览网格'"
                     placement="right">
              <Icon :type="grid.shown ? 'eye-disabled' : 'eye'"
                    size="24"></Icon>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
    <div class="editor_property_container">
      <editor-property></editor-property>
    </div>
    <div class="preview-iframe"
         id="preview-iframe-container">
      <editor-simulator active-index="0"
                        :is-preview="true"
                        style="width: 375px; height: 667px;"
                        id="preview-iframe-for-screenshot"></editor-simulator>
    </div>
  </div>
</template>
<style scoped>
.preview-iframe {
  position: fixed;
  left: 0;
  top: -10000px;
  opacity: 0;
  width: 375px;
  height: 667px;
}
.activity_edit_container {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: transparent;
  overflow-x: hidden;
}
.editor_components_container {
  position: absolute;
  left: -200px;
  top: 0;
  width: 200px;
  height: 100%;
  /*display: flex;*/
  /*align-items: center;*/
  /*justify-content: space-between;*/
  background-color: #ffffff;
  z-index: 9;
  /*border-right: 1px solid rgba(30, 36, 50, 0.36);*/
  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  -webkit-transform: translate(40px, 0);
  -moz-transform: translate(40px, 0);
  -ms-transform: translate(40px, 0);
  -o-transform: translate(40px, 0);
  transform: translate(40px, 0);
  -webkit-transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -ms-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}
.editor_components_container.shown {
  -webkit-transform: translate(200px, 0);
  -moz-transform: translate(200px, 0);
  -ms-transform: translate(200px, 0);
  -o-transform: translate(200px, 0);
  transform: translate(200px, 0);
}
.editor_components_container_header {
  width: 100%;
  height: 40px;
  background-color: #f5f5f9;
}
.editor_components_container_body {
  width: 100%;
  height: calc(100% - 40px);
  background-color: #f5f5f5;
}
.editor_components_left {
  width: 160px;
  height: 100%;
}
.editor_components_toggle_container {
  float: right;
  width: 40px;
  height: 100%;
  cursor: pointer;
}
.editor_components_toggle {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  transform: rotate(180deg);
  -webkit-transition: all 0.3s ease-in-out;
  -moz-transition: all 0.3s ease-in-out;
  -ms-transition: all 0.3s ease-in-out;
  -o-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
  -webkit-transition-delay: 0.3s;
  -moz-transition-delay: 0.3s;
  -ms-transition-delay: 0.3s;
  -o-transition-delay: 0.3s;
  transition-delay: 0.3s;
}
.editor_components_container.shown .editor_components_toggle {
  -webkit-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  -ms-transform: rotate(0deg);
  -o-transform: rotate(0deg);
  transform: rotate(0deg);
}

.editor_main_container {
  position: absolute;
  left: 40px;
  z-index: 8;
  width: calc(100% - 40px - 300px);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.editor_main_simulator_selector {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 7;
  width: 100%;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7f9;
}
.simulator_size {
  margin-left: 20px;
  font-size: 14px;
}
.editor_main_simulator {
  position: relative;
  z-index: 6;
  /*width: 375px;*/
  /*height: 667px;*/
  background-color: transparent;
}
.editor_simulator_operation_container {
  position: absolute;
  right: -55px;
  top: 50%;
  margin-top: -100px;
  width: 25px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}
.editor_simulator_operation_item {
  width: 25px;
  height: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
}
.editor_simulator_operation_item_normal {
  color: #464c5b;
}
.editor_simulator_operation_item:hover {
  opacity: 1;
}
.editor_simulator_operation_item.active {
  opacity: 1;
}
.editor_simulator_operation_item.disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.editor_simulator_operation_item_delete {
  color: #ed3f14;
}
.editor_simulator_operation_item_add {
  color: #19be6b;
}
.editor_property_container {
  position: absolute;
  width: 300px;
  height: 100%;
  z-index: 9;
  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  right: 0;
  background-color: #ffffff;
}
.page_count {
  width: 25px;
  height: 75px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #464c5b;
  opacity: 0.7;
}
.page_count_current input {
  font-size: 24px;
  font-weight: bold;
  opacity: 1;
  color: #464c5b;
}
.page_count_current {
  font-size: 24px !important;
  font-weight: bold;
  opacity: 1;
}
.page_count_total {
  font-size: 14px;
}
</style>
<script>
import * as types from '../../../store/mutation-types'
import utils from '../../../utils/index'
export default {
  name: 'ActivityEdit',
  data () {
    return {
      editorMainContainerRef: 'editor-main-container-ref',
      currentPageRef: 'pageCountCurrent',
      simulators: [
        {
          name: 'iPhone 5',
          width: 640,
          height: 1136,
          dpr: 2
        },
        {
          name: 'iPhone 6',
          width: 750,
          height: 1334,
          dpr: 2
        },
        {
          name: 'iPhone 6 Plus',
          width: 828,
          height: 1472,
          dpr: 2
        }
      ],
      simulatorScale: {
        value: 2,
        options: [
          {
            value: 1.5
          },
          {
            value: 1.25
          },
          {
            value: 1
          },
          {
            value: 0.9
          },
          {
            value: 0.8
          },
          {
            value: 0.7
          },
          {
            value: 0.6
          },
          {
            value: 0.5
          }
        ]
      },
      selectedSimulatorIndex: 1,
      uuid: this.$route.query.q,
      requestInfo: this.$store.state.requestInfo,
      actInfo: {},
      editorComponentsContainerShown: false,
      events: this.$store.state.events,
      eventHub: this.$store.state.eventHub,
      platform: 'windows',
      isSaving: false,
      bodyClicked: false,
      pageTemplate: {
        'type': 'zpm-page',
        'uuid': '',
        'style': {
          'background-color': '#FFFFFF'
        },
        'children': []
      }
    }
  },
  computed: {
    currentPageIndex: {
      get () {
        return this.$store.state.currentPageIndex
      },
      set (index) {
        this.$store.commit(types.SET_CURRENT_PAGE_INDEX, {
          index: Number(index)
        })
      }
    },
    pageData () {
      return this.$store.state.activityInfo.data ? JSON.parse(JSON.stringify(this.$store.state.activityInfo.data.pages)) : []
    },
    activityInfoChanged () {
      return this.$store.state.activityInfoChanged
    },
    activityInfo () {
      return this.$store.state.activityInfo
    },
    grid () {
      return this.$store.state.grid
    }
  },
  async created () {
    //      let isWin = (navigator.platform === 'Win32') || (navigator.platform === 'Windows')
    let isMac = (navigator.platform === 'Mac68K') || (navigator.platform === 'MacPPC') || (navigator.platform === 'Macintosh') || (navigator.platform === 'MacIntel')
    isMac && (this.platform = 'mac')
    let paramActivityInfo = (this.$route.params.activityInfo ? JSON.parse(JSON.stringify(this.$route.params.activityInfo)) : {})
    if (utils.isEmptyObj(paramActivityInfo)) {
      // 从接口取模板数据
      await this.getTemplateData()
    } else {
      this.actInfo = paramActivityInfo
    }
    if (this.actInfo.data) {
      this.actInfo.data = JSON.parse(this.actInfo.data)
    }
    this.$store.commit(types.INIT_LOCAL_TEMPLATE, {
      template: this.actInfo
    })
    this.$store.commit(types.SET_CURRENT_PAGE_INDEX, {
      index: 0
    })
    this.$nextTick(() => {
      this.$store.commit(types.SET_APP_HEAER, {
        component: () => import('./editor/Components.vue')
      })
      this.eventHub.$on(this.events.bodyClick, this.bodyClickHandler)
      this.eventHub.$on(this.events.saveActivity, this.saveActivity)
      setTimeout(() => {
        // 页面初始化时自动点击 '.editor_main_container' 元素，默认可设置整个活动的属性
        let editorMainContainer = this.$refs[this.editorMainContainerRef]
        // 要先focus，再调用click()，才能使得document.activeElement返回正确的元素。
        // 如果未focus，直接调用click()，document.activeElement会返回body
        editorMainContainer.focus()
        editorMainContainer.click()
      }, 1)
    })
  },
  mounted () {
    const that = this
    this.$store.commit(types.FOLD_SIDE_MENU, {
      fold: true
    })
    this.setSimulatorProperty()
    window.onkeydown = function (ev) {
      if (that.$route.name === 'ActivityEdit') {
        if (that.platform === 'mac') {
          if (ev.metaKey && ev.shiftKey && ev.keyCode === 83) {
            // mac下 command + shift + s
            that.saveActivity()
          } else if (ev.metaKey && ev.keyCode === 38) {
            // 上一页
            that.prevPage()
          } else if (ev.metaKey && ev.keyCode === 40) {
            // 下一页
            that.nextPage()
          }
        } else {
          if (ev.ctrlKey && ev.shiftKey && ev.keyCode === 83) {
            // windows下  control + shift + s 保存
            that.saveActivity()
          } else if (ev.ctrlKey && ev.keyCode === 38) {
            // 上一页
            that.prevPage()
          } else if (ev.ctrlKey && ev.keyCode === 40) {
            // 下一页
            that.nextPage()
          }
        }
      }
    }
  },
  methods: {
    toggleGrid () {
      if (this.grid.shown) {
        this.$store.commit(types.HIDE_SIMULATOR_GRID)
      } else {
        this.$store.commit(types.SHOW_SIMULATOR_GRID)
      }
    },
    bodyClickHandler () {
      if (!this.bodyClicked) {
        this.bodyClicked = true
      }
      let activeElement = document.activeElement
      let activeComponentType = activeElement.getAttribute('com-type')
      if (activeComponentType === 'activity') {
        // 设置整个活动的属性
        let templateData = ((!this.actInfo.data || utils.isEmptyObj(this.actInfo.data)) ? {} : JSON.parse(JSON.stringify(this.actInfo.data)))
        if (templateData.pages) {
          delete templateData.pages
        }
        this.$store.commit(types.ACTIVE_COMPONENT, {
          type: 'zpm-' + activeComponentType,
          uuid: '',
          template: templateData || {}
        })
        this.eventHub.$emit(this.events.activeComponentChanged, {
          type: 'zpm-' + activeComponentType,
          uuid: '',
          template: templateData || {}
        })
      }
    },
    nextPage () {
      this.$store.commit(types.NEXT_PAGE)
    },
    prevPage () {
      this.$store.commit(types.PREV_PAGE)
    },
    setSimulatorProperty () {
      let _selectedSimulator = this.simulators[this.selectedSimulatorIndex]
      this.$store.commit(types.SET_SIMULATOR, {
        name: _selectedSimulator.name,
        width: _selectedSimulator.width,
        height: _selectedSimulator.height,
        dpr: _selectedSimulator.dpr,
        scale: this.simulatorScale.options[this.simulatorScale.value].value
      })
      this.eventHub.$emit(this.events.simulatorChanged)
    },
    async getTemplateData () {
      let templateData = await this.$store.dispatch(types.AJAX, {
        baseUrl: this.requestInfo.baseUrl,
        url: this.requestInfo.getActivity,
        data: {
          uuid: this.uuid
        }
      })
      if (templateData.status === 200) {
        this.actInfo = templateData.data
      }
    },
    toggleEditorComponentsContainer () {
      this.editorComponentsContainerShown = !this.editorComponentsContainerShown
    },
    async saveActivity (args) {
      if (!this.activityInfoChanged) {
        return
      }
      this.$Loading.start()
      let saveLoading = this.$Message.loading({
        content: '保存中，请稍后...',
        duration: 0
      })
      let screenshotIframe = document.getElementById('preview-iframe-for-screenshot')
      let screenshot = await this.screenshot({
        el: screenshotIframe,
        rename: true
      })
      let thumbnail = ''
      if (screenshot.status === 200 && screenshot.data && screenshot.data.data && screenshot.data.data.path) {
        thumbnail = screenshot.data.data.path
      }
      // 保存活动模板
      this.isSaving = true
      this.eventHub.$emit(this.events.saveActivityBefore)
      let _templateData = JSON.parse(JSON.stringify(this.$store.state.activityInfo.data))
      let editData = await this.$store.dispatch(types.AJAX, {
        baseUrl: this.requestInfo.baseUrl,
        url: this.requestInfo.editActivity,
        data: {
          uuid: this.uuid,
          thumbnail: thumbnail || 'https://static.dei2.com/plugins_admin/img/127x200.png',
          desc: this.$store.state.activityInfo.desc || '我的第一个活动',
          data: JSON.stringify(_templateData)
        }
      })
      setTimeout(() => {
        this.isSaving = false
        setTimeout(saveLoading, 1)
        if (editData.status === 200) {
          this.$Message.success({
            content: '保存成功',
            duration: 3
          })
          this.$Loading.finish()
        } else {
          this.$Message.error({
            content: editData.message || '保存活动失败，请重试',
            duration: 3
          })
          this.$Loading.error()
        }
        this.$store.commit(types.ACTIVITY_INFO_UNCHANGED)
        this.eventHub.$emit(this.events.saveActivityCallback, {
          success: (editData.status === 200)
        })
      }, 800)
    },
    addPage () {
      this.$store.commit(types.ADD_LOCAL_PAGE, {
        index: this.currentPageIndex,
        template: JSON.parse(JSON.stringify(this.pageTemplate))
      })
    },
    removePage () {
      if (this.activityInfo.data && this.activityInfo.data.pages && this.activityInfo.data.pages.length > 1) {
        this.$store.commit(types.DEL_LOCAL_PAGE, {
          index: this.currentPageIndex
        })
      }
    }
  },
  watch: {
    '$store.state.activityInfo': {
      deep: true,
      handler: function () {
        if (this.bodyClicked) {
          this.$store.commit(types.ACTIVITY_INFO_CHANGED)
        }
      }
    }
  },
  components: {
    EditorComponent: () => import('./editor/Components.vue'),
    EditorSimulator: () => import('./editor/Simulator.vue'),
    EditorProperty: () => import('./editor/Property.vue'),
    ActivityPreview: () => import('./ActivityPreview.vue')
  }
}
</script>
