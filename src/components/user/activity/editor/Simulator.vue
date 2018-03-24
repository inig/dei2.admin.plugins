<template>
  <div class="simulator_container" style="border: 1px solid red;" tabindex="1000" :com-type="pData.type" :com-uuid="pData.uuid" :style="[pData.style, {width: simulatorInfo.width + 'px', height: simulatorInfo.height + 'px', transform: 'scale(' + parseFloat(simulatorInfo.scale) + ')'}]">
    <div class="auxiliary_grid" v-if="!isPreview" style="position: absolute;" :style="{width: simulatorInfo.width * simulatorInfo.scale + grid.alignmentLineWidth * 4 + 'px', height: simulatorInfo.height * simulatorInfo.scale + grid.alignmentLineWidth * 4 + 'px', left: '-' + grid.alignmentLineWidth * 2 + 'px', top: '-' + grid.alignmentLineWidth * 2 + 'px'}">
      <canvas class="auxiliary_grid_canvas" id="auxiliaryGridCanvas" :width="simulatorInfo.width * simulatorInfo.scale + grid.alignmentLineWidth * 4" :height="simulatorInfo.height * simulatorInfo.scale + grid.alignmentLineWidth * 4"></canvas>
    </div>
    <zpm-draggable v-for="(item, index) in pData.children" :key="item.type" :class="{active: (activeComponentType === item.type && activeComponentId === item.uuid)}" :com-style="[initStyles(item.style)[0]]" :uuid="item.uuid" v-if="!isPreview">
      <div class="component_item">
        <component class="component" :is="pData.children[index].type" :com-data="item"></component>
        <div class="close_btn_container">
          <Icon type="close-round" size="18"></Icon>
        </div>
      </div>
    </zpm-draggable>
    <div class="component_item" v-for="(item, index) in pData.children" :key="item.type" :class="{active: (activeComponentType === item.type && activeComponentId === item.uuid)}" :style="[initStyles(item.style)[0]]" v-else>
      <component class="component" :is="pData.children[index].type" :com-data="item"></component>
      <div class="close_btn_container">
        <Icon type="close-round" size="18"></Icon>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .simulator_container {
    position: relative;
    display: flex;
    align-items: center;
    background-size: cover;
    /*background-attachment: fixed;*/
    background-position: 50% 50%;
    -webkit-box-shadow: 0 0 20px 6px darkgray;
    -moz-box-shadow: 0 0 20px 6px darkgray;
    box-shadow: 0 0 20px 6px darkgray;
  }
  /*.component_item {*/
    /*position: absolute;*/
    /*cursor: pointer;*/
    /*border-width: 4px;*/
    /*border-style: solid;*/
    /*border-color: transparent;*/
    /*margin-left: -4px;*/
    /*margin-top: -4px;*/
  /*}*/
  /*.component_item:hover {*/
    /*border-style: dashed;*/
    /*border-color: darkgreen;*/
  /*}*/

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
      },
      isPreview: {
        type: Boolean
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
        box: {},
        styles: [],
        eventHub: this.$store.state.eventHub,
        events: this.$store.state.events
      }
    },
    computed: {
      pData () {
        return this.$store.state.activityInfo.data.pages[(this.activeIndex || Number(this.$store.state.currentPageIndex))] || {}
      },
      grid () {
        return this.$store.state.grid
      }
    },
    created () {
      this.$nextTick(() => {
        this.eventHub.$on(this.events.bodyClick, this.bodyClickHandler)
        if (!this.isPreview) {
          this.drawGrid()
          let _ran = Math.floor(Math.random() * 6) + 1
          console.log('..........', _ran)
          this.drawLine(1)
          this.drawLine(2)
          this.drawLine(3)
          this.drawLine(4)
          this.drawLine(5)
          this.drawLine(6)
        }
      })
    },
    watch: {
      'grid.shown': function (val) {
        if (!this.isPreview) {
          if (val) {
            this.drawGrid()
          } else {
            this.clearGrid()
          }
        }
      }
    },
    methods: {
      clearGrid () {
        let auxiliaryGridCanvas = document.getElementById('auxiliaryGridCanvas')
        let ctx = auxiliaryGridCanvas.getContext('2d')
        let canvasBox = auxiliaryGridCanvas.getBoundingClientRect()
        let boxWidth = canvasBox.width * 2
        let boxHeight = canvasBox.height * 2
        ctx.clearRect(0, 0, boxWidth, boxHeight)
      },
      drawGrid () {
        let auxiliaryGridCanvas = document.getElementById('auxiliaryGridCanvas')
        let ctx = auxiliaryGridCanvas.getContext('2d')
        let canvasBox = auxiliaryGridCanvas.getBoundingClientRect()
        let boxWidth = canvasBox.width * 2
        let boxHeight = canvasBox.height * 2
        let countX = this.grid.lineCountX
        let countY = this.grid.lineCountY
        let eachWidth = boxWidth / countX
        let eachHeight = boxHeight / countY
        ctx.beginPath()
        ctx.strokeStyle = this.grid.lineColor
        ctx.lineWidth = this.grid.lineWidth
        // 画垂直方向的线
        for (let i = 1; i < countY; i++) {
          ctx.moveTo(0, i * eachHeight)
          ctx.lineTo(boxWidth, i * eachHeight)
        }
        // 画水平方向的线
        for (let j = 1; j < countX; j++) {
          ctx.moveTo(j * eachWidth, 0)
          ctx.lineTo(j * eachWidth, boxHeight)
        }
        ctx.stroke()
        ctx.closePath()
      },
      drawLine (index) {
        // 画对齐线，左、上、右、下、水平、垂直 线分别为：1，2，3，4，5，6
        let auxiliaryGridCanvas = document.getElementById('auxiliaryGridCanvas')
        let ctx = auxiliaryGridCanvas.getContext('2d')
        let canvasBox = auxiliaryGridCanvas.getBoundingClientRect()
        let boxWidth = canvasBox.width * 2
        let boxHeight = canvasBox.height * 2
        ctx.strokeStyle = this.grid.alignmentLineColor
        let _w = this.grid.alignmentLineWidth
        ctx.lineWidth = _w * 2
        ctx.beginPath()
        switch (Number(index)) {
          case 1:
            ctx.moveTo(_w, _w)
            ctx.lineTo(_w, boxHeight - _w)
            break
          case 2:
            ctx.strokeStyle = 'cyan'
            ctx.moveTo(_w, _w)
            ctx.lineTo(boxWidth - _w, _w)
            break
          case 3:
            ctx.strokeStyle = 'blue'
            ctx.moveTo(boxWidth - _w, _w)
            ctx.lineTo(boxWidth - _w, boxHeight - _w)
            break
          case 4:
            ctx.strokeStyle = 'black'
            ctx.moveTo(boxWidth - _w, boxHeight - _w)
            ctx.lineTo(_w, boxHeight - _w)
            break
          case 5:
            break
          case 6:
            break
          default:
            break
        }
//        switch (Number(index)) {
//          case 1:
//            ctx.moveTo(_w / 2, _w)
//            ctx.lineTo(_w / 2, boxHeight - _w * 2)
//            break
//          case 2:
//            ctx.moveTo(_w, _w / 2)
//            ctx.lineTo(boxWidth - _w * 2, _w / 2)
//            break
//          case 3:
//            ctx.moveTo(boxWidth - _w, _w)
//            ctx.lineTo(boxWidth - _w, boxHeight - _w * 2)
//            break
//          case 4:
//            ctx.moveTo(boxWidth - _w, boxHeight - _w)
//            ctx.lineTo(_w, boxHeight - _w)
//            break
//          case 5:
//            ctx.moveTo(0, boxHeight / 2)
//            ctx.lineTo(boxWidth, boxHeight / 2)
//            break
//          case 6:
//            ctx.moveTo(boxWidth / 2, 0)
//            ctx.lineTo(boxWidth / 2, boxHeight)
//            break
//          default:
//            break
//        }
        ctx.stroke()
        ctx.closePath()
      },
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
        let adjustedStyles = this.adjustStyles(JSON.parse(JSON.stringify(style)))
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
      ZpmButton: () => import('../coms/Button.vue'),
      ZpmImage: () => import('../coms/Image.vue'),
      ZpmDraggable: () => import('../../../ZpmDraggable.vue')
    }
  }
</script>
