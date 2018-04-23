<template>
  <div ref="wrapper" class="list-wrapper">
    <div class="scroll-content">
      <div ref="listWrapper">
        <slot>
          <!--<ul class="list-content">-->
            <!--<li @click="clickItem($event,item)" class="list-item" v-for="item in data">{{item}}</li>-->
          <!--</ul>-->
        </slot>
      </div>
      <slot name="pullup"
            :pullUpLoad="pullUpLoad"
            :isPullUpLoad="isPullUpLoad"
      >
        <div class="pullup-wrapper" v-if="pullUpLoad">
          <div class="before-trigger" v-if="!isPullUpLoad">
            <div style="font-size: 13px; color: #888; text-align: center;" v-html="pullUpTxt"></div>
          </div>
          <div class="after-trigger" v-else>
            <loading></loading>
          </div>
        </div>
      </slot>
    </div>
    <slot name="pulldown"
          :pullDownRefresh="pullDownRefresh"
          :pullDownStyle="pullDownStyle"
          :beforePullDown="beforePullDown"
          :isPullingDown="isPullingDown"
          :bubbleY="bubbleY"
    >
      <div ref="pulldown" class="pulldown-wrapper" :style="pullDownStyle" v-if="pullDownRefresh">
        <div class="before-trigger" v-if="beforePullDown">
          <bubble :y="bubbleY"></bubble>
        </div>
        <div class="after-trigger" v-else>
          <div v-if="isPullingDown" class="loading">
            <loading></loading>
          </div>
          <div v-else style="font-size: 13px; color: #888; text-align: center;" v-html="refreshTxt"></div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import Loading from './Loading.vue'
  import Bubble from './Bubble.vue'

  const COMPONENT_NAME = 'scroll'
//  const DIRECTION_H = 'horizontal'
//  const DIRECTION_V = 'vertical'

  const getRect = function (el) {
    if (el instanceof window.SVGElement) {
      let rect = el.getBoundingClientRect()
      return {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      }
    } else {
      return {
        top: el.offsetTop,
        left: el.offsetLeft,
        width: el.offsetWidth,
        height: el.offsetHeight
      }
    }
  }

  let OPTIONS = {
    scrollbar: {
      fade: true,
      interactive: false
    },
    startX: 0,
    startY: 0,
    scrollX: false,
    scrollY: true,
    click: true,
//            tap: true,
    probeType: 1, // 非实时的触发 scroll 事件
    mouseWheel: {
      speed: 20,
      invert: false
    }
  }

  const isDOM = function (obj) {
    return (typeof HTMLElement === 'object') ? (obj instanceof HTMLElement) : (obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string')
  }

  export default {
    name: COMPONENT_NAME,
    props: {
      data: {
        type: null,
        default: function () {
          return []
        }
      },
      options: {
        type: Object,
        default: function () {
          return {}
        }
      },
      pullDownRefresh: {
        type: null,
        default: false
      },
      pullUpLoad: {
        type: null,
        default: false
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      listenBeforeScroll: {
        type: Boolean,
        default: false
      },
      refreshDelay: {
        type: Number,
        default: 20
      },
      scrollToEle: {
        type: null,
        default: ''
      }
    },
    data () {
      return {
        beforePullDown: true,
        isRebounding: false,
        isPullingDown: false,
        isPullUpLoad: false,
        pullUpDirty: true,
        pullDownStyle: '',
        bubbleY: 0,
        scrollOptions: {}
      }
    },
    computed: {
      pullUpTxt () {
        const moreTxt = (this.options.pullUpLoad && this.options.pullUpLoad.txt && this.options.pullUpLoad.txt.more) || (OPTIONS.pullUpLoad.txt.more)

        const noMoreTxt = (this.options.pullUpLoad && this.options.pullUpLoad.txt && this.options.pullUpLoad.txt.noMore) || (OPTIONS.pullUpLoad.txt.noMore)

        return this.pullUpDirty ? moreTxt : noMoreTxt
      },
      refreshTxt () {
        return (this.options.pullDownRefresh && this.options.pullDownRefresh.txt) || (OPTIONS.pullDownRefresh.txt)
      }
    },
    created () {
      this.pullDownInitTop = -50
    },
    mounted () {
      setTimeout(() => {
        this.initScroll()
        setTimeout(() => {
          this.scrollToElement(this.scrollToEle, 800)
        }, 800)
      }, 20)
    },
    methods: {
      initScroll (callback) {
        if (!this.$refs.wrapper) {
          return
        }
        if (this.$refs.listWrapper && (this.pullDownRefresh || this.pullUpLoad)) {
          this.$refs.listWrapper.style.minHeight = `${getRect(this.$refs.wrapper).height + 1}px`
        }
        if (this.pullDownRefresh) {
          OPTIONS = Object.assign({}, OPTIONS, {
            pullDownRefresh: {
              threshold: 90,
              stop: 40,
              txt: '刷新成功'
            }
          })
        }
        if (this.pullUpLoad) {
          OPTIONS = Object.assign({}, OPTIONS, {
            pullUpLoad: {
              threshold: 0,
              txt: {
                more: '加载更多',
                noMore: '无更多数据'
              }
            }
          })
        }
        this.scrollOptions = Object.assign({}, OPTIONS, this.options)
        this.scroll = new BScroll(this.$refs.wrapper, this.scrollOptions)

        if (this.listenScroll) {
          this.scroll.on('scroll', (pos) => {
            this.$emit('scroll', pos)
          })
        }

        if (this.listenBeforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScrollStart')
          })
        }

        if (this.pullDownRefresh) {
          this._initPullDownRefresh()
        }

        if (this.pullUpLoad) {
          this._initPullUpLoad()
        }

        callback && callback()
      },
      disable () {
        this.scroll && this.scroll.disable()
      },
      enable () {
        this.scroll && this.scroll.enable()
      },
      refresh () {
        this.scroll && this.scroll.refresh()
      },
      scrollTo () {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement () {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      },
      clickItem (e, item) {
        this.$emit('click', item)
      },
      destroy () {
        this.scroll.destroy()
      },
      forceUpdate (dirty) {
        if (this.pullDownRefresh && this.isPullingDown) {
          this.isPullingDown = false
          this._reboundPullDown().then(() => {
            this._afterPullDown()
          })
        } else if (this.pullUpLoad && this.isPullUpLoad) {
          this.isPullUpLoad = false
          this.scroll.finishPullUp()
          this.pullUpDirty = dirty
          setTimeout(() => {
            this.refresh()
            this.scroll.scrollTo(this.scrollOptions.scrollX ? (this.scroll.maxScrollX - 1) : 0, this.scrollOptions.scrollY ? (this.scroll.maxScrollY - 1) : 0, 300)
          }, 10)
        } else {
          this.refresh()
        }
      },
      _initPullDownRefresh () {
        this.scroll.on('pullingDown', () => {
          this.beforePullDown = false
          this.isPullingDown = true
          this.pullUpDirty = true
          this.$emit('pullingDown')
        })

        this.scroll.on('scroll', (pos) => {
          if (!this.pullDownRefresh) {
            return
          }
          if (this.beforePullDown) {
            this.bubbleY = Math.max(0, pos.y + this.pullDownInitTop)
            this.pullDownStyle = `top:${Math.min(pos.y + this.pullDownInitTop, 10)}px`
          } else {
            this.bubbleY = 0
          }

          if (this.isRebounding) {
            this.pullDownStyle = `top:${10 - (this.pullDownRefresh.stop - pos.y)}px`
          }
        })
      },
      _initPullUpLoad () {
        this.scroll.on('pullingUp', () => {
          this.isPullUpLoad = true
          this.$emit('pullingUp')
        })
      },
      _reboundPullDown () {
        const {stopTime = 600} = this.pullDownRefresh
        return new Promise((resolve) => {
          setTimeout(() => {
            this.isRebounding = true
            this.scroll.finishPullDown()
            resolve()
          }, stopTime)
        })
      },
      _afterPullDown () {
        setTimeout(() => {
          this.pullDownStyle = `top:${this.pullDownInitTop}px`
          this.beforePullDown = true
          this.isRebounding = false
          this.refresh()
        }, this.scroll.options.bounceTime)
      }
    },
    watch: {
      data: {
        deep: true,
        handler () {
          setTimeout(() => {
            this.forceUpdate(true)
          }, this.refreshDelay)
        }
      },
      scrollToEle (val) {
        if (val && isDOM(val)) {
          // 只接受DOM类型
          this.scrollToElement(val, 800)
        }
      }
    },
    components: {
      Loading,
      Bubble
    }
  }
</script>

<style>
  .list-wrapper {
    position: relative;
    /*height: 100%;*/
    overflow: hidden;
    background: #fff;
  }
  .list-wrapper .scroll-content {
    position: relative;
    z-index: 1;
  }
  .list-wrapper .scroll-content .list-content {
    position: relative;
    z-index: 10;
    background: #fff;
  }
  .list-wrapper .scroll-content .list-content .list-item {
    height: 60px;
    line-height: 60px;
    font-size: 18px;
    padding-left: 20px;
    border-bottom: 1px solid #e5e5e5;
  }

  .pulldown-wrapper {
    position: absolute;
    width: 100%;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all;
  }
  .pulldown-wrapper .after-trigger {
    margin-top: 10px;
  }

  .pullup-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 0;
  }
</style>
