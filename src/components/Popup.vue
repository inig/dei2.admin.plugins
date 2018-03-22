<template>
  <div class="fullscreen_popup_container" :ref="popupRef">
    <component :ref="popupInnerRef" :is="fullScreenPopup.subCom.Template" :style="[fullScreenPopup.subComStyle]"></component>
    <div class="preview_operation_container" :style="[previewOperationContainerBox]" :class="{shown: (fullScreenPopup.subComType === 'preview') && showPreviewOperation}">
      <div class="preview_operation_item" @mouseenter="showContentContainer" @mouseleave="hideContentContainer">
        <img class="preview_operation_item_image" v-if="fullScreenPopup.subComType === 'preview'" src="https://static.dei2.com/imgs/qrcode.png">
        <div class="preview_operation_content_container" :ref="contentRef" :style="[previewOperationContentBox]">
          <div class="preview_operation_content_inner" :ref="contentInnerRef">
            <div class="qrcode_container" :ref="qrcodeRef"></div>
            <div class="preview_tips" v-text="fullScreenPopup.previewTips"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup_close_container" :style="[closeContainerBox]" :class="{shown: showClose}" @click="close">
      <Icon type="close-round" size="20"></Icon>
    </div>
  </div>
</template>
<style scoped>
  .fullscreen_popup_container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 9999;
    display: none;
    opacity: 0;
    -webkit-transition: all .3s ease-in-out;
    -moz-transition: all .3s ease-in-out;
    -ms-transition: all .3s ease-in-out;
    -o-transition: all .3s ease-in-out;
    transition: all .3s ease-in-out;
    align-items: center;
    justify-content: center;
  }
  .fullscreen_popup_container.show {
    display: flex;
  }
  .fullscreen_popup_container.animated {
    opacity: 1;
  }
  .popup_close_container {
    position: absolute;
    width: 40px;
    height: 40px;
    background-color: #000;
    border-radius: 20px;
    color: #ffffff;
    z-index: 9;
    opacity: 0;
    -webkit-transition: all .01s ease-in-out;
    -moz-transition: all .01s ease-in-out;
    -ms-transition: all .01s ease-in-out;
    -o-transition: all .01s ease-in-out;
    transition: all .01s ease-in-out;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .popup_close_container.shown {
    opacity: 1;
  }
  .preview_operation_container {
    position: absolute;
    width: 30px;
    height: 400px;
    background-color: transparent;
    z-index: 8;
    opacity: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    -webkit-transition: all .01s ease-in-out;
    -moz-transition: all .01s ease-in-out;
    -ms-transition: all .01s ease-in-out;
    -o-transition: all .01s ease-in-out;
    transition: all .01s ease-in-out;
  }
  .preview_operation_container.shown {
    opacity: 1;
  }
  .preview_operation_item {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 8px;
    cursor: pointer;
  }
  .preview_operation_item_image {
    width: 30px;
    height: 30px;
  }
  .preview_operation_content_container {
    position: absolute;
    background-color: transparent;
    overflow: hidden;
    display: none;
  }
  .preview_operation_content_container.shown {
    display: block;
  }
  .preview_operation_content_inner {
    width: 100%;
    height: 100%;
    background-color: #464c5b;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    -webkit-transform: translate(100%, 0);
    -moz-transform: translate(100%, 0);
    -ms-transform: translate(100%, 0);
    -o-transform: translate(100%, 0);
    transform: translate(100%, 0);
    -webkit-transition: all .3s ease-in-out;
    -moz-transition: all .3s ease-in-out;
    -ms-transition: all .3s ease-in-out;
    -o-transition: all .3s ease-in-out;
    transition: all .3s ease-in-out;
  }
  .preview_operation_content_inner.shown {
    -webkit-transform: translate(0%, 0);
    -moz-transform: translate(0%, 0);
    -ms-transform: translate(0%, 0);
    -o-transform: translate(0%, 0);
    transform: translate(0%, 0);
  }
  .qrcode_container {
    border-radius: 5px;
    background-color: #ffffff;
    padding: 5px;
    border: 1px solid #F5F5FD;
  }
  .preview_tips {
    margin-top: 15px;
    color: #F5F5FD;
    font-size: 14px;
  }
</style>
<script>
  import * as types from '../store/mutation-types'
  const QRCode = require('../assets/js/qrcode')
  export default {
    name: 'Popup',
    data () {
      return {
        popupRef: 'fullscreen-popup-ref',
        popupInnerRef: 'popup-inner-ref',
        contentRef: 'content-ref',
        contentInnerRef: 'content-inner-ref',
        qrcodeRef: 'qrcode-ref',
        closeContainerBox: {},
        showClose: false,
        previewOperationContainerBox: {},
        showPreviewOperation: false,
        previewOperationContentBox: {},
        showPreviewOperationContent: false,
        showContainer: false,
        showContentInner: false,
        qrcode: null
      }
    },
    computed: {
      fullScreenPopup () {
        return this.$store.state.fullScreenPopup
      },
      showFullScreenPopup () {
        return this.$store.state.fullScreenPopup.shown
      }
    },
    created () {
      this.$nextTick(() => {
        const that = this
        let ele = this.$refs[this.popupRef]
        ele.addEventListener('transitionend', this.getBox, false)
        ele.addEventListener('transition', this.getBox, false)
        window.onresize = function () {
          that.getBox()
        }
        let contentInner = this.$refs[this.contentInnerRef]
        contentInner.addEventListener('transitionend', this.hideContainer, false)
        contentInner.addEventListener('transition', this.hideContainer, false)
      })
    },
    methods: {
      initQRCode (opts) {
        this.qrcode = new QRCode(this.$refs[this.qrcodeRef], {
          width: 120,
          height: 120,
          colorDark: '#464c5b',
          colorLight: '#F5F5FD'
        })
        this.qrcode.makeCode(opts.text)
      },
      showContentContainer () {
        let contentContainer = this.$refs[this.contentRef]
        let contentInner = this.$refs[this.contentInnerRef]
        contentInner.removeEventListener('transitionend', this.hideContainer)
        contentInner.removeEventListener('transition', this.hideContainer)
        if (this.fullScreenPopup.subComType === 'preview') {
          this.$refs[this.qrcodeRef].innerHTML = ''
          this.initQRCode({
            text: this.fullScreenPopup.previewQRCode
          })
        }
        !contentContainer.classList.contains('shown') && contentContainer.classList.add('shown')
        setTimeout(() => {
          !contentInner.classList.contains('shown') && contentInner.classList.add('shown')
        }, 10)
      },
      hideContentContainer () {
        let contentInner = this.$refs[this.contentInnerRef]
        contentInner.addEventListener('transitionend', this.hideContainer, false)
        contentInner.addEventListener('transition', this.hideContainer, false)
        contentInner.classList.contains('shown') && contentInner.classList.remove('shown')
      },
      hideContainer () {
        let contentContainer = this.$refs[this.contentRef]
        contentContainer.classList.contains('shown') && contentContainer.classList.remove('shown')
      },
      getBox () {
        this.getCloseContainerBox()
        if (this.fullScreenPopup.subComType === 'preview') {
          this.getPreviewOperationContainerBox()
          this.getPreviewOperationContentBox()
        }
      },
      getCloseContainerBox () {
        let popupInnerRef = this.$refs[this.popupInnerRef]
        if (this.showFullScreenPopup && popupInnerRef) {
          let _left = popupInnerRef.$el.offsetWidth + popupInnerRef.$el.offsetLeft - 20
          if (_left < 0) {
            _left = 0
          }
          let _top = popupInnerRef.$el.offsetTop - 20
          if (_top < 0) {
            _top = 0
          }
          this.closeContainerBox = {
            left: _left + 'px',
            top: _top + 'px'
          }
          this.showClose = true
        }
      },
      getPreviewOperationContainerBox () {
        let popupInnerRef = this.$refs[this.popupInnerRef]
        if (this.showFullScreenPopup && popupInnerRef) {
          let _left = popupInnerRef.$el.offsetWidth + popupInnerRef.$el.offsetLeft
          if (_left < 0) {
            _left = 0
          }
          let _top = popupInnerRef.$el.offsetTop
          let _height = popupInnerRef.$el.offsetHeight
          this.previewOperationContainerBox = {
            left: _left + 'px',
            top: _top + 'px',
            height: _height + 'px'
          }
          this.showPreviewOperation = true
        }
      },
      getPreviewOperationContentBox () {
        let popupInnerRef = this.$refs[this.popupInnerRef]
        if (this.showFullScreenPopup && popupInnerRef) {
          let _height = popupInnerRef.$el.offsetHeight
          let _width = popupInnerRef.$el.offsetWidth
          this.previewOperationContentBox = {
            width: _width + 'px',
            left: -_width + 'px',
            top: '0px',
            height: _height + 'px'
          }
        }
      },
      showPopup () {
        let ele = this.$refs[this.popupRef]
        !ele.classList.contains('show') && ele.classList.add('show')
        setTimeout(() => {
          !ele.classList.contains('animated') && ele.classList.add('animated')
        }, 20)
      },
      hidePopup () {
        let ele = this.$refs[this.popupRef]
        ele.classList.contains('animated') && ele.classList.remove('animated')
        setTimeout(() => {
          ele.classList.contains('show') && ele.classList.remove('show')
        }, 400)
      },
      close () {
        this.$store.commit(types.HIDE_FULL_SCREEN_POPUP)
      }
    },
    watch: {
      'showFullScreenPopup': function (val) {
        val ? this.showPopup() : this.hidePopup()
      }
    },
    components: {}
  }
</script>
