<template>
  <div class="activity_preview_container">
    <div class="activity_preview_wrapper" id="activity_preview_pages" :style="{width: isPc ? '375px' : '100%', height: isPc ? '667px' : '100%'}">
      <div class="activity_preview_page page1">
        第一页
      </div>
      <div class="activity_preview_page page2">
        第二页
      </div>
      <div class="activity_preview_page page3">
        第三页
      </div>
    </div>
  </div>
</template>
<style scoped>
  .activity_preview_container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .activity_preview_wrapper {
    position: relative;
  }
  .activity_preview_page {
    position:absolute;
    width: 100%;
    height: 100%;
    top:0;
    left:0;
    font-size: 18px;
    color: #ffffff;
    font-weight: bold;
    text-align: center;
  }
  .page1 {
    background-color: red;
  }
  .page2 {
    background-color: cadetblue;
  }
  .page3 {
    background-color: #2d8cf0;
  }
</style>
<script>
  import PageSwitch from 'pageswitch'
  export default {
    name: 'ActivityPreview',
    data () {
      return {
        isPc: !navigator.userAgent.match(/(iphone)|(android)/i)
      }
    },
    created () {
      this.$nextTick(() => {
        let ts = 'flip3dX'
        let ps = new PageSwitch('activity_preview_pages', {
          duration: 1000,
          start: 0,
          direction: 1,
          loop: true,
          ease: /flip(?!Paper)/.test(ts) ? 'bounce' : 'ease',
          transition: ts,
          mouse: true,
          mousewheel: true,
          arrowkey: true
        })
        console.log('>>>>', ps)
      })
    },
    components: {}
  }
</script>
