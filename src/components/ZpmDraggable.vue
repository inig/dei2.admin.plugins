<template>
  <v-touch class="zpm_draggable_container" :style="[realStyle, {borderWidth: defaultBorderWidth + 'px'}]" @panmove="touchMove" @panend="touchEnd">
    <div :ref="uuid" class="zpm_draggable_inner">
      <slot></slot>
    </div>
  </v-touch>
</template>
<style lang="scss">
  @import "../assets/css/theme.scss";
  .zpm_draggable_container {
    position: absolute;
    cursor: pointer;
    /*border-width: 4px;*/
    border-style: solid;
    border-color: transparent;
    /*margin-left: -4px;*/
    /*margin-top: -4px;*/
  }
  .zpm_draggable_container:hover {
    border-style: dashed;
    border-color: $theme;
  }
  .zpm_draggable_container.active {
    border-style: dashed;
    border-color: $theme;
  }
  .zpm_draggable_container .close_btn_container {
    position: absolute;
    top: -14px;
    right: -14px;
    width: 28px;
    height: 28px;
    border-radius: 14px;
    border-right: 10px;
    background-color: $theme;
    color: #ffffff;
    display: none;
    align-items: center;
    justify-content: center;
  }
  .zpm_draggable_container:hover .close_btn_container {
    display: flex;
  }
  .zpm_draggable_container.active .close_btn_container {
    display: flex;
  }
</style>
<script>
  export default {
    name: 'ZpmDraggable',
    props: {
      uuid: {
        type: String
      },
      comStyle: {
        type: Array
      }
    },
    data () {
      return {
        defaultBorderWidth: 4,
        draggableContainerBox: {
          left: 0,
          top: 0
        },
        adjustStyle: this.comStyle[0],
        realStyle: this.comStyle[0]
      }
    },
    computed: {
      simulator () {
        return this.$store.state.simulator
      }
    },
    created () {
      this.$nextTick(() => {
        setTimeout(() => {
          this.initStyle()
        }, 1)
      })
    },
    methods: {
      initStyle () {
        let ele = this.$refs[this.uuid].querySelector('.component_item')
        if (ele) {
          let eleBox = ele.getBoundingClientRect()
          this.style = {
            width: (eleBox.width * this.simulator.dpr + 2 * this.defaultBorderWidth) + 'px',
            height: (eleBox.height * this.simulator.dpr + 2 * this.defaultBorderWidth) + 'px'
          }
        }
      },
      touchMove (evt) {
        let _adjustStyle = JSON.parse(JSON.stringify(this.adjustStyle))
        let _realStyle = {}
        _realStyle.left = (parseFloat(_adjustStyle.left) + evt.deltaX * this.simulator.dpr) + 'px'
        _realStyle.top = (parseFloat(_adjustStyle.top) + evt.deltaY * this.simulator.dpr) + 'px'
        this.realStyle = _realStyle
      },
      touchEnd (evt) {
        this.adjustStyle = JSON.parse(JSON.stringify(this.realStyle))
      }
    },
    components: {}
  }
</script>
