<template>
  <div class="activity_edit_container">
    <div class="editor_components_container" :class="{'shown': editorComponentsContainerShown}">
      <div class="editor_components_left">
        <editor-component></editor-component>
      </div>
      <div class="editor_components_toggle" @click="toggleEditorComponentsContainer"></div>
    </div>
    <div class="editor_main_container">
      <div class="editor_main_simulator_selector">
        <Select v-model="selectedSimulatorIndex" size="small" style="width: 120px" @on-change="setSimulatorProperty">
          <Option v-for="(item, index) in simulators" :value="index" :key="item.name">{{ item.name }}</Option>
        </Select>
        <p class="simulator_size" tabindex="9">
          <span>{{simulators[selectedSimulatorIndex].width}}</span>x<span>{{simulators[selectedSimulatorIndex].height}}</span>
        </p>
        <p class="simulator_size">
          <Select v-model="simulatorScale.value" size="small" filterable style="width: 80px" @on-change="setSimulatorProperty">
            <Option v-for="(item, index) in simulatorScale.options" :value="index" :key="item.value">{{ item.value * 100 }}%</Option>
          </Select>
        </p>
        <Tooltip :content="platform === 'mac' ? '按Command+Shift+S保存活动模板' : '按Control+Shift+S保存模板'" placement="bottom-end" style="position: absolute; right: 15px;">
          <Button type="primary" size="small" @click="saveActivity">保存模板</Button>
        </Tooltip>
      </div>
      <div class="editor_main_simulator" tabindex="10"
           :style="{transform: 'scale(' + parseFloat(1 / simulators[selectedSimulatorIndex].dpr) + ')'}">
        <editor-simulator :page-index="currentPageIndex"></editor-simulator>
      </div>
    </div>
    <div class="editor_property_container">
      <editor-property></editor-property>
    </div>
  </div>
</template>
<style scoped>
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #ffffff;
    z-index: 9;
    /*border-right: 1px solid rgba(30, 36, 50, 0.36);*/
    -webkit-box-shadow: 0 1px 1px rgba(0,0,0,.1);
    -moz-box-shadow: 0 1px 1px rgba(0,0,0,.1);
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
    -webkit-transform: translate(200px, 0);
    -moz-transform: translate(200px, 0);
    -ms-transform: translate(200px, 0);
    -o-transform: translate(200px, 0);
    transform: translate(200px, 0);
    -webkit-transition: all .2s ease-in-out;
    -moz-transition: all .2s ease-in-out;
    -ms-transition: all .2s ease-in-out;
    -o-transition: all .2s ease-in-out;
    transition: all .2s ease-in-out;
  }
  .editor_components_container.shown {
    -webkit-transform: translate(40px, 0);
    -moz-transform: translate(40px, 0);
    -ms-transform: translate(40px, 0);
    -o-transform: translate(40px, 0);
    transform: translate(40px, 0);
  }
  .editor_components_left {
    width: 160px;
    height: 100%;
  }
  .editor_components_toggle {
    width: 40px;
    height: 100%;
    cursor: pointer;
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
    z-index: 6;
    /*width: 375px;*/
    /*height: 667px;*/
    background-color: transparent;
  }

  .editor_property_container {
    position: absolute;
    width: 300px;
    height: 100%;
    z-index: 9;
    -webkit-box-shadow: 0 1px 1px rgba(0,0,0,.1);
    -moz-box-shadow: 0 1px 1px rgba(0,0,0,.1);
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
    right: 0;
    background-color: #ffffff;
  }
</style>
<script>
  import * as types from '../../../store/mutation-types'
  import utils from '../../../utils/index'
  export default {
    name: 'ActivityEdit',
    data () {
      return {
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
        editorComponentsContainerShown: true,
        events: this.$store.state.events,
        eventHub: this.$store.state.eventHub,
        currentPageIndex: this.$store.state.currentPageIndex,
        platform: 'windows'
      }
    },
    computed: {
      pageData () {
        return (utils.isEmptyObj(JSON.parse(this.actInfo.data)) ? [] : JSON.parse(this.actInfo.data).pages)
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
      this.$store.commit(types.INIT_LOCAL_TEMPLATE, {
        template: (utils.isEmptyObj(JSON.parse(this.actInfo.data)) ? [] : JSON.parse(this.actInfo.data).pages)
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
            }
          } else {
            if (ev.ctrlKey && ev.shiftKey && ev.keyCode === 83) {
              // windows下  control + shift + s 保存
              that.saveActivity()
            }
          }
        }
      }
    },
    methods: {
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
      saveActivity () {
        // 保存活动模板
        this.$Message.success('保存成功')
      }
    },
    components: {
      EditorComponent: () => import('./editor/Components.vue'),
      EditorSimulator: () => import('./editor/Simulator.vue'),
      EditorProperty: () => import('./editor/Property.vue')
    }
  }
</script>
