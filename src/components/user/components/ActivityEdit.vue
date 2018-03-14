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
        <Select v-model="selectedSimulatorIndex" size="small" style="width: 120px">
          <Option v-for="(item, index) in simulators" :value="index" :key="item.name">{{ item.name }}</Option>
        </Select>
        <p class="simulator_size">
          <span>{{simulators[selectedSimulatorIndex].width}}</span>x<span>{{simulators[selectedSimulatorIndex].height}}</span>
        </p>
      </div>
      <div class="editor_main_simulator" :style="{width: simulators[selectedSimulatorIndex].width + 'px', height: simulators[selectedSimulatorIndex].height + 'px'}"></div>
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
    width: calc(100% - 40px - 200px);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .editor_main_simulator_selector {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .simulator_size {
    margin-left: 20px;
    font-size: 14px;
  }
  .editor_main_simulator {
    width: 375px;
    height: 667px;
    background-color: rgba(18,231,255,0.38);
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
            width: 320,
            height: 568,
            dpr: 2
          },
          {
            name: 'iPhone 6',
            width: 375,
            height: 667,
            dpr: 2
          },
          {
            name: 'iPhone 6 Plus',
            width: 414,
            height: 736,
            dpr: 2
          }
        ],
        selectedSimulatorIndex: 1,
        uuid: this.$route.query.q,
        requestInfo: this.$store.state.requestInfo,
        actInfo: {},
        editorComponentsContainerShown: true
      }
    },
    async created () {
      let paramActivityInfo = (this.$route.params.activityInfo ? JSON.parse(JSON.stringify(this.$route.params.activityInfo)) : {})
      if (utils.isEmptyObj(paramActivityInfo)) {
        // 从接口取模板数据
        await this.getTemplateData()
      } else {
        this.actInfo = paramActivityInfo
      }
    },
    mounted () {
      this.$store.commit(types.FOLD_SIDE_MENU, {
        fold: true
      })
    },
    methods: {
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
      }
    },
    components: {
      EditorComponent: () => import('./editor/Components.vue')
    }
  }
</script>
