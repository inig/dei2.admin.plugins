<template>
  <div class="zpm_scroll_container wrapper" :ref="scrollRef">
    <slot></slot>
  </div>
</template>
<style>

</style>
<script>
  import BScroll from 'better-scroll'
  export default {
    name: 'ZpmScroll',
    props: {
      options: {
        type: Object
      },
      data: { // 列表数据，用于触发refresh()，如果数据变化，则触发refresh()方法
        type: Array,
        default: []
      },
      pullUp: { // 是否需要 上拉加载更多 功能
        type: Boolean,
        default: false
      },
      pullDown: { // 是否需要 下拉刷新 功能
        type: Boolean,
        default: false
      },
      beforeScroll: { // 是否需要 监听beforeScroll事件
        type: Boolean,
        default: false
      },
      scroll: { // 是否需要 监听scroll事件
        type: Boolean,
        default: false
      },
      scrollX: { // 是否开启横向滚动
        type: Boolean,
        default: false
      },
      scrollY: { // 是否开启纵向滚动
        type: Boolean,
        default: true
      },
      pullUpDist: { // 离底部多少px触发 上拉加载更多 功能
        type: Number,
        default: 50
      },
      pullDownDist: { // 离顶部多少px触发 下拉刷新 功能
        type: Number,
        default: 50
      }
    },
    data () {
      return {
        scrollRef: 'scroll-ref',
        scroller: null,
        refreshDelay: 20
      }
    },
    created () {
      this.$nextTick(() => {
        setTimeout(() => {
          this._init()
        }, 20)
      })
    },
    methods: {
      _init () {
        if (!this.$refs[this.scrollRef]) {
          return
        }
        let scrollOps = {
          probeType: 1,
          click: true,
          tap: true,
          scrollX: this.scrollX,
          scrollY: this.scrollY
        }
        if (this.options) {
          scrollOps = Object.assign({}, scrollOps, this.options)
        }
        this.scroller = new BScroll(this.$refs[this.scrollRef], scrollOps)
        // 是否监听scroll事件
        if (this.scroll) {
          this.scroller.on('scroll', pos => {
            this.$emit('scroll', pos)
          })
        }
        // 是否监听 beforeScroll 事件
        if (this.beforeScroll) {
          this.scroller.on('beforeScrollStart', () => {
            this.$emit('before-scroll')
          })
        }
        // 是否需要 上拉加载更多 功能
        if (this.pullUp) {
          this.scroller.on('scrollEnd', () => {
            if (this.scroller.y <= (this.scroller.maxScrollY + this.pullUpDist)) {
              this.$emit('pull-up')
            }
          })
        }
        // 是否需要 下拉刷新 功能
        if (this.pullDown) {
          this.scroller.on('touchend', pos => {
            if (pos.y > this.pullDownDist) {
              this.$emit('pull-down')
            }
          })
        }
        this.$emit('initialed', this.scroller)
      },
      refresh () {
        this.scroller && this.scroller.refresh()
      },
      disable () {
        this.scroller && this.scroller.disable()
      },
      enable () {
        this.scroller && this.scroller.enable()
      },
      scrollTo () {
        this.scroller && this.scroller.scrollTo.apply(this.scroller, arguments)
      },
      scrollToElement () {
        this.scroller && this.scroller.scrollToElement.apply(this.scroller, arguments)
      },
      destroy () {
        this.scroller && this.scroller.destroy()
      }
    },
    watch: {
      data () {
        // 监听数据的变化，延时refreshDelay时间后调用refresh方法重新计算，保证滚动效果正常
        setTimeout(() => {
          this.refresh()
        }, this.refreshDelay)
      }
    },
    components: {}
  }
</script>
