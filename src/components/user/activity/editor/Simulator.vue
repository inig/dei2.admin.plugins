<template>
  <div class="simulator_container" tabindex="1000" :com-type="pData.type" :com-uuid="pData.uuid" :style="[pData.style, {width: simulatorInfo.width + 'px', height: simulatorInfo.height + 'px', transform: 'scale(' + parseFloat(simulatorInfo.scale) + ')'}]">
    <div class="component_item" v-for="(item, index) in pData.children" :key="item.type" :class="{active: (activeComponentType === item.type && activeComponentId === item.uuid)}" :style="[initStyles(item.style)[0]]">
      <component class="component" :is="pData.children[index].type" :com-data="item"></component>
      <div class="close_btn_container">
        <Icon type="close-round" size="18"></Icon>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .simulator_container {
    display: flex;
    align-items: center;
    background-size: cover;
    /*background-attachment: fixed;*/
    background-position: 50% 50%;
    -webkit-box-shadow: 0 0 20px 6px darkgray;
    -moz-box-shadow: 0 0 20px 6px darkgray;
    box-shadow: 0 0 20px 6px darkgray;
  }
  .component_item {
    position: absolute;
    cursor: pointer;
    border-width: 4px;
    border-style: solid;
    border-color: transparent;
    margin-left: -4px;
    margin-top: -4px;
  }
  .component_item:hover {
    border-style: dashed;
    border-color: darkgreen;
  }
  .close_btn_container {
    position: absolute;
    top: -14px;
    right: -14px;
    width: 28px;
    height: 28px;
    border-radius: 14px;
    border-right: 10px;
    background-color: darkgreen;
    color: #ffffff;
    display: none;
    align-items: center;
    justify-content: center;
  }
  .component_item:hover .close_btn_container {
    display: flex;
  }
  .component_item.active {
    border-style: dashed;
    border-color: darkgreen;
  }
  .component_item.active .close_btn_container {
    display: flex;
  }
  .component {
    /*position: relative;*/
  }
</style>
<script>
  import * as types from '../../../../store/mutation-types'
  export default {
    name: 'Simulator',
    props: {
      activeIndex: {
        type: String
      }
    },
    data () {
      return {
        simulatorInfo: this.$store.state.simulator,
        activeComponentType: 'zpm-component', // 激活状态元素的类型，page、component
        activeComponentId: '', // 激活状态的组件uuid
        activeComponentTemplate: {}, // 激活状态组件的template
        comStyle: {},
        containerStyle: {},
        componentStyle: {},
        eventHub: this.$store.state.eventHub,
        events: this.$store.state.events
      }
    },
    computed: {
      pData () {
        return this.$store.state.activityInfo.data.pages[(this.activeIndex || Number(this.$store.state.currentPageIndex))] || {}
      }
    },
    created () {
      this.$nextTick(() => {
        this.eventHub.$on(this.events.bodyClick, this.bodyClickHandler)
      })
    },
    methods: {
      findTemplateByUUID (uuid) {
        let pageData = this.pData
        if (!pageData.children || pageData.children.length < 1) {
          return {}
        }
        let i = 0
        let outTemplate = {}
        for (i; i < pageData.children.length; i++) {
          if (pageData.children[i].uuid === uuid) {
            outTemplate = pageData.children[i]
            i = pageData.children.length
          }
        }
        return outTemplate
      },
      bodyClickHandler () {
        let activeElement = document.activeElement
        let activeComponentType = activeElement.getAttribute('com-type')
        let activeComponentUUID = activeElement.getAttribute('com-uuid')
        // if (!activeComponentType || !activeComponentUUID) {
        if (!activeComponentType || !activeComponentUUID || (activeComponentUUID === this.$store.state.activeComponent.uuid)) {
          return
        }
        if (activeComponentType === 'zpm-page') {
          this.activeComponentTemplate = this.pData
        } else {
          this.activeComponentTemplate = this.findTemplateByUUID(activeComponentUUID)
        }
        this.$store.commit(types.ACTIVE_COMPONENT, {
          type: activeComponentType,
          uuid: activeComponentUUID,
          template: this.activeComponentTemplate
        })
        this.activeComponentId = activeComponentUUID
        this.activeComponentType = activeComponentType
        this.eventHub.$emit(this.events.activeComponentChanged, {
          uuid: activeComponentUUID,
          type: activeComponentType,
          template: this.activeComponentTemplate
        })
      },
      calcToRealPx (px) {
        // 将750设计图上的尺寸 转变为 真实尺寸
        return parseFloat(px * this.simulatorInfo.width / 750)
//        return parseFloat(px * this.simulatorInfo.width / this.simulatorInfo.dpr / 750)
      },
      adjustStyles (style) {
        const that = this
        let _comStyle = JSON.stringify(style)
        _comStyle = _comStyle.replace(/(\d+)/g, function (item) {
          return that.calcToRealPx(parseFloat(item))
        })
        return JSON.parse(_comStyle)
      },
      initStyles (style) {
        let _containerStyle = {}
        let _componentStyle = {}
        let adjustedStyles = this.adjustStyles(style)
        for (let item in adjustedStyles) {
          if (adjustedStyles.hasOwnProperty(item)) {
            switch (item) {
              case 'left':
                _containerStyle.left = adjustedStyles[item]
                break
              case 'top':
                _containerStyle.top = adjustedStyles[item]
                break
              case 'right':
                _containerStyle.right = adjustedStyles[item]
                break
              case 'bottom':
                _containerStyle.bottom = adjustedStyles[item]
                break
              default:
                _componentStyle[item] = adjustedStyles[item]
                break
            }
          }
        }
        return [_containerStyle, _componentStyle]
      }
    },
    components: {
      ZpmButton: () => import('../coms/Button.vue')
    }
  }
</script>
