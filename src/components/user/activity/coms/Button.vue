<template>
  <div class="com_button_container" :tabindex="10" :com-type="comData.type" :com-uuid="comData.uuid">
    <button :style="[componentStyle]" v-text="comData.value" style="pointer-events: none;"></button>
  </div>
</template>
<style>
  .com_button_container {
    /*position: absolute;*/
    /*cursor: pointer;*/
  }
  .com_button_container:hover {
    /*border-style: dashed;*/
    /*border-color: darkgreen;*/
  }
</style>
<script>
  import utils from '../../../../utils/index'
  export default {
    name: 'Button',
    props: {
      comData: {
        type: Object,
        require: true
      }
    },
    data () {
      return {
        uuid: utils.getUUID('zpm-button-'),
        simulatorInfo: this.$store.state.simulator,
        comStyle: {},
        containerStyle: {},
        componentStyle: {},
        eventHub: this.$store.state.eventHub,
        events: this.$store.state.events
      }
    },
    created () {
      this.initStyles()
      this.eventHub.$on(this.events.simulatorChanged, this.initStyles)
    },
    methods: {
      calcToRealPx (px) {
        // 将750设计图上的尺寸 转变为 真实尺寸
        return parseFloat(px * this.simulatorInfo.width / 750)
//        return parseFloat(px * this.simulatorInfo.width / this.simulatorInfo.dpr / 750)
      },
      adjustStyles () {
        const that = this
        let _comStyle = JSON.stringify(this.comData.style)
        _comStyle = _comStyle.replace(/(\d+)/g, function (item) {
          return that.calcToRealPx(parseFloat(item))
        })
        this.comStyle = JSON.parse(_comStyle)
      },
      initStyles () {
        let _containerStyle = {}
        let _componentStyle = {}
        this.adjustStyles()
        let _comStyle = this.comStyle
        for (let item in _comStyle) {
          if (_comStyle.hasOwnProperty(item)) {
            switch (item) {
              case 'left':
                _containerStyle.left = _comStyle[item]
                break
              case 'top':
                _containerStyle.top = _comStyle[item]
                break
              case 'right':
                _containerStyle.right = _comStyle[item]
                break
              case 'bottom':
                _containerStyle.bottom = _comStyle[item]
                break
              default:
                _componentStyle[item] = _comStyle[item]
                break
            }
          }
        }
        this.containerStyle = _containerStyle
        this.componentStyle = _componentStyle
      }
    },
    components: {}
  }
</script>
