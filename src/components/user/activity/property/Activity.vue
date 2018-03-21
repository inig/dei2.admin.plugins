<template>
  <div class="property_activity_container">
    <Form class="property_form" :label-width="60">
      <FormItem label="页面动画">
        <Select v-model="activeComponent.template.animation" style="width: 210px;" @on-change="changeAnimation">
          <OptionGroup v-for="(item, index) in animations" :key="index" :label="item.name">
            <Option v-for="(itm, idx) in animations[index].children" :key="itm.value" :value="itm.value">{{itm.name}}</Option>
          </OptionGroup>
        </Select>
      </FormItem>
      <FormItem>
        <Tooltip :content="platform === 'mac' ? '按Command+Shift+S保存活动' : '按Control+Shift+S保存活动'" placement="bottom-end">
          <Button type="primary" :loading="isSaving" icon="paper-airplane" size="small" @click="saveActivity">
            <span v-if="!isSaving">保存模板</span>
            <span v-else>保存中...</span>
          </Button>
        </Tooltip>
        <Tooltip :content="platform === 'mac' ? '按Command+Shift+P预览活动' : '按Control+Shift+P预览活动'" placement="bottom-end" style="margin-left: 8px;">
          <Button type="ghost" icon="eye" size="small" @click="previewActivity">
            预览
          </Button>
        </Tooltip>
      </FormItem>
    </Form>
  </div>
</template>
<style scoped>
  .property_activity_container {
    width: 100%;
    height: 100%;
  }
  .property_form {
    padding: 15px;
  }
</style>
<script>
  import * as types from '../../../../store/mutation-types'
  export default {
    name: 'PropertyActivity',
    data () {
      return {
        animations: [
          {
            name: '隐现效果',
            children: [
              {
                name: 'fade',
                value: 'fade'
              }
            ]
          },
          {
            name: '滚动效果',
            children: [
              {
                name: 'scroll',
                value: 'scroll'
              },
              {
                name: 'scroll3d',
                value: 'scroll3d'
              },
              {
                name: 'scrollCover',
                value: 'scrollCover'
              },
              {
                name: 'scrollCoverReverse',
                value: 'scrollCoverReverse'
              },
              {
                name: 'scrollCoverIn',
                value: 'scrollCoverIn'
              },
              {
                name: 'scrollCoverOut',
                value: 'scrollCoverOut'
              },
              {
                name: 'scrollX',
                value: 'scrollX'
              },
              {
                name: 'scroll3dX',
                value: 'scroll3dX'
              },
              {
                name: 'scrollCoverX',
                value: 'scrollCoverX'
              },
              {
                name: 'scrollCoverReverseX',
                value: 'scrollCoverReverseX'
              },
              {
                name: 'scrollCoverInX',
                value: 'scrollCoverInX'
              },
              {
                name: 'scrollCoverOutX',
                value: 'scrollCoverOutX'
              },
              {
                name: 'scrollY',
                value: 'scrollY'
              },
              {
                name: 'scroll3dY',
                value: 'scroll3dY'
              },
              {
                name: 'scrollCoverY',
                value: 'scrollCoverY'
              },
              {
                name: 'scrollCoverReverseY',
                value: 'scrollCoverReverseY'
              },
              {
                name: 'scrollCoverInY',
                value: 'scrollCoverInY'
              },
              {
                name: 'scrollCoverOutY',
                value: 'scrollCoverOutY'
              }
            ]
          },
          {
            name: '滑动效果',
            children: [
              {
                name: 'slide',
                value: 'slide'
              },
              {
                name: 'slideCover',
                value: 'slideCover'
              },
              {
                name: 'slideCoverReverse',
                value: 'slideCoverReverse'
              },
              {
                name: 'slideCoverIn',
                value: 'slideCoverIn'
              },
              {
                name: 'slideCoverOut',
                value: 'slideCoverOut'
              },
              {
                name: 'slideX',
                value: 'slideX'
              },
              {
                name: 'slideCoverX',
                value: 'slideCoverX'
              },
              {
                name: 'slideCoverReverseX',
                value: 'slideCoverReverseX'
              },
              {
                name: 'slideCoverInX',
                value: 'slideCoverInX'
              },
              {
                name: 'slideCoverOutX',
                value: 'slideCoverOutX'
              },
              {
                name: 'slideY',
                value: 'slideY'
              },
              {
                name: 'slideCoverY',
                value: 'slideCoverY'
              },
              {
                name: 'slideCoverReverseY',
                value: 'slideCoverReverseY'
              },
              {
                name: 'slideCoverInY',
                value: 'slideCoverInY'
              },
              {
                name: 'slideCoverOutY',
                value: 'slideCoverOutY'
              }
            ]
          },
          {
            name: '封面效果',
            children: [
              {
                name: 'flow',
                value: 'flow'
              },
              {
                name: 'flowCover',
                value: 'flowCover'
              },
              {
                name: 'flowCoverReverse',
                value: 'flowCoverReverse'
              },
              {
                name: 'flowCoverIn',
                value: 'flowCoverIn'
              },
              {
                name: 'flowCoverOut',
                value: 'flowCoverOut'
              },
              {
                name: 'flowX',
                value: 'flowX'
              },
              {
                name: 'flowCoverX',
                value: 'flowCoverX'
              },
              {
                name: 'flowCoverReverseX',
                value: 'flowCoverReverseX'
              },
              {
                name: 'flowCoverInX',
                value: 'flowCoverInX'
              },
              {
                name: 'flowCoverOutX',
                value: 'flowCoverOutX'
              },
              {
                name: 'flowY',
                value: 'flowY'
              },
              {
                name: 'flowCoverY',
                value: 'flowCoverY'
              },
              {
                name: 'flowCoverReverseY',
                value: 'flowCoverReverseY'
              },
              {
                name: 'flowCoverInY',
                value: 'flowCoverInY'
              },
              {
                name: 'flowCoverOutY',
                value: 'flowCoverOutY'
              }
            ]
          },
          {
            name: '裁切效果',
            children: [
              {
                name: 'slice',
                value: 'slice'
              },
              {
                name: 'sliceX',
                value: 'sliceX'
              },
              {
                name: 'sliceY',
                value: 'sliceY'
              }
            ]
          },
          {
            name: '缩放效果',
            children: [
              {
                name: 'zoom',
                value: 'zoom'
              },
              {
                name: 'zoomCover',
                value: 'zoomCover'
              },
              {
                name: 'zoomCoverReverse',
                value: 'zoomCoverReverse'
              },
              {
                name: 'zoomCoverIn',
                value: 'zoomCoverIn'
              },
              {
                name: 'zoomCoverOut',
                value: 'zoomCoverOut'
              },
              {
                name: 'zoomX',
                value: 'zoomX'
              },
              {
                name: 'zoomCoverX',
                value: 'zoomCoverX'
              },
              {
                name: 'zoomCoverReverseX',
                value: 'zoomCoverReverseX'
              },
              {
                name: 'zoomCoverInX',
                value: 'zoomCoverInX'
              },
              {
                name: 'zoomCoverOutX',
                value: 'zoomCoverOutX'
              },
              {
                name: 'zoomY',
                value: 'zoomY'
              },
              {
                name: 'zoomCoverY',
                value: 'zoomCoverY'
              },
              {
                name: 'zoomCoverReverseY',
                value: 'zoomCoverReverseY'
              },
              {
                name: 'zoomCoverInY',
                value: 'zoomCoverInY'
              },
              {
                name: 'zoomCoverOutY',
                value: 'zoomCoverOutY'
              }
            ]
          },
          {
            name: '扭曲效果',
            children: [
              {
                name: 'skew',
                value: 'skew'
              },
              {
                name: 'skewCover',
                value: 'skewCover'
              },
              {
                name: 'skewCoverReverse',
                value: 'skewCoverReverse'
              },
              {
                name: 'skewCoverIn',
                value: 'skewCoverIn'
              },
              {
                name: 'skewCoverOut',
                value: 'skewCoverOut'
              },
              {
                name: 'skewX',
                value: 'skewX'
              },
              {
                name: 'skewCoverX',
                value: 'skewCoverX'
              },
              {
                name: 'skewCoverReverseX',
                value: 'skewCoverReverseX'
              },
              {
                name: 'skewCoverInX',
                value: 'skewCoverInX'
              },
              {
                name: 'skewCoverOutX',
                value: 'skewCoverOutX'
              },
              {
                name: 'skewY',
                value: 'skewY'
              },
              {
                name: 'skewCoverY',
                value: 'skewCoverY'
              },
              {
                name: 'skewCoverReverseY',
                value: 'skewCoverReverseY'
              },
              {
                name: 'skewCoverInY',
                value: 'skewCoverInY'
              },
              {
                name: 'skewCoverOutY',
                value: 'skewCoverOutY'
              }
            ]
          },
          {
            name: '翻转效果',
            children: [
              {
                name: 'flip',
                value: 'flip'
              },
              {
                name: 'flip3d',
                value: 'flip3d'
              },
              {
                name: 'flipClock',
                value: 'flipClock'
              },
              {
                name: 'flipPaper',
                value: 'flipPaper'
              },
              {
                name: 'flipCover',
                value: 'flipCover'
              },
              {
                name: 'flipCoverReverse',
                value: 'flipCoverReverse'
              },
              {
                name: 'flipCoverIn',
                value: 'flipCoverIn'
              },
              {
                name: 'flipCoverOut',
                value: 'flipCoverOut'
              },
              {
                name: 'flipX',
                value: 'flipX'
              },
              {
                name: 'flip3dX',
                value: 'flip3dX'
              },
              {
                name: 'flipClockX',
                value: 'flipClockX'
              },
              {
                name: 'flipPaperX',
                value: 'flipPaperX'
              },
              {
                name: 'flipCoverX',
                value: 'flipCoverX'
              },
              {
                name: 'flipCoverReverseX',
                value: 'flipCoverReverseX'
              },
              {
                name: 'flipCoverInX',
                value: 'flipCoverInX'
              },
              {
                name: 'flipCoverOutX',
                value: 'flipCoverOutX'
              },
              {
                name: 'flipY',
                value: 'flipY'
              },
              {
                name: 'flip3dY',
                value: 'flip3dY'
              },
              {
                name: 'flipClockY',
                value: 'flipClockY'
              },
              {
                name: 'flipPaperY',
                value: 'flipPaperY'
              },
              {
                name: 'flipCoverY',
                value: 'flipCoverY'
              },
              {
                name: 'flipCoverReverseY',
                value: 'flipCoverReverseY'
              },
              {
                name: 'flipCoverInY',
                value: 'flipCoverInY'
              },
              {
                name: 'flipCoverOutY',
                value: 'flipCoverOutY'
              }
            ]
          },
          {
            name: '爆炸效果',
            children: [
              {
                name: 'bomb',
                value: 'bomb'
              },
              {
                name: 'bombCover',
                value: 'bombCover'
              },
              {
                name: 'bombCoverReverse',
                value: 'bombCoverReverse'
              },
              {
                name: 'bombCoverIn',
                value: 'bombCoverIn'
              },
              {
                name: 'bombCoverOut',
                value: 'bombCoverOut'
              },
              {
                name: 'bombX',
                value: 'bombX'
              },
              {
                name: 'bombCoverX',
                value: 'bombCoverX'
              },
              {
                name: 'bombCoverReverseX',
                value: 'bombCoverReverseX'
              },
              {
                name: 'bombCoverInX',
                value: 'bombCoverInX'
              },
              {
                name: 'bombCoverOutX',
                value: 'bombCoverOutX'
              },
              {
                name: 'bombY',
                value: 'bombY'
              },
              {
                name: 'bombCoverY',
                value: 'bombCoverY'
              },
              {
                name: 'bombCoverReverseY',
                value: 'bombCoverReverseY'
              },
              {
                name: 'bombCoverInY',
                value: 'bombCoverInY'
              },
              {
                name: 'bombCoverOutY',
                value: 'bombCoverOutY'
              }
            ]
          }
        ],
        platform: 'windows',
        isSaving: false,
        eventHub: this.$store.state.eventHub,
        events: this.$store.state.events,
        lastEvent: ''
      }
    },
    created () {
      let isMac = (navigator.platform === 'Mac68K') || (navigator.platform === 'MacPPC') || (navigator.platform === 'Macintosh') || (navigator.platform === 'MacIntel')
      isMac && (this.platform = 'mac')
      this.$nextTick(() => {
        this.eventHub.$on(this.events.saveActivityCallback, this.saveActivityCallback)
        this.eventHub.$on(this.events.saveActivityBefore, this.saveActivityBefore)
      })
    },
    computed: {
      activeComponent () {
        return this.$store.state.activeComponent
      }
    },
    methods: {
      changeAnimation (e) {
        this.$store.commit(types.UPDATE_ACTIVITY_PROPERTY, {
          animation: e
        })
      },
      saveActivity () {
        this.isSaving = true
        this.eventHub.$emit(this.events.saveActivity)
      },
      saveActivityBefore () {
        this.isSaving = true
      },
      saveActivityCallback () {
        this.isSaving = false
        if (this.lastEvent === 'preview') {
          this.showPopup()
        }
        this.lastEvent = ''
      },
      previewActivity () {
        this.lastEvent = 'preview'
        this.saveActivity()
      },
      showPopup () {
        this.$store.commit(types.SHOW_FULL_SCREEN_POPUP, {
          subCom: {
            Template: () => import('../ActivityPreview.vue')
          },
          subComType: 'preview',
          subComStyle: {
            width: '375px',
            height: '667px',
            backgroundColor: 'cyan',
            overflow: 'hidden'
          }
        })
      }
    },
    components: {}
  }
</script>
