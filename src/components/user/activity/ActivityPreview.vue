<template>
  <div class="activity_preview_container">
    <div class="activity_preview_loading" v-if="pageLoadStatus === status.LOADING" :style="{width: isPc ? '375px' : '100%', height: isPc ? '667px' : '100%', 'box-shadow': isPc ? '0 0 20px 4px #ccc' : 'none'}">
      <div class="page_inner">
        <Spin size="large"></Spin>
      </div>
    </div>
    <div class="activity_preview_fail" v-else-if="pageLoadStatus === status.FAIL" :style="{width: isPc ? '375px' : '100%', height: isPc ? '667px' : '100%', 'box-shadow': isPc ? '0 0 20px 4px #ccc' : 'none'}">
      <div class="page_inner">
        数据加载错误
      </div>
    </div>
    <div class="activity_preview_wrapper" id="activity_preview_pages" v-else :style="{width: isPc ? '375px' : '100%', height: isPc ? '667px' : '100%', 'box-shadow': isPc ? '0 0 20px 4px #ccc' : 'none'}">
      <div class="activity_preview_page" v-for="(item, index) in activityInfo.pages" :key="item.uuid">
        <div class="page_inner" :style="[item.style]">
        </div>
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
    /*overflow: hidden;*/
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
  .page_inner {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover;
    /*background-attachment: fixed;*/
    background-position: 50% 50%;
  }
</style>
<script>
  import PageSwitch from 'pageswitch'
  import * as types from '../../../store/mutation-types'
  import utils from '../../../utils/index'
  export default {
    name: 'ActivityPreview',
    data () {
      return {
        status: {
          LOADING: 'loading',
          SUCCESS: 'success',
          FAIL: 'fail'
        },
        pageLoadStatus: '', // 页面加载状态，loading: 加载中；success：加载成功；fail：加载失败
        uuid: this.$route.query.q,
        requestInfo: this.$store.state.requestInfo,
        pageData: {},
        isPc: !navigator.userAgent.match(/(iphone)|(android)/i)
      }
    },
    computed: {
      activityInfo () {
        if (!utils.isEmptyObj(this.pageData)) {
          return JSON.parse(this.pageData.data)
        } else {
          return {}
        }
      }
    },
    created () {
      this.$nextTick(() => {
        this.pageInit()
      })
    },
    methods: {
      async initData () {
        this.pageLoadStatus = this.status.LOADING
        let templateData = await this.$store.dispatch(types.AJAX, {
          baseUrl: this.requestInfo.baseUrl,
          url: this.requestInfo.getPreviewActivity,
          data: {
            uuid: this.uuid
          }
        })
        if (templateData.status === 200) {
          this.pageLoadStatus = this.status.SUCCESS
          this.pageData = templateData.data
        } else {
          this.pageLoadStatus = this.status.FAIL
        }
      },
      async pageInit () {
        await this.initData()
        if (utils.isEmptyObj(this.pageData)) {
          this.$Message.error({
            content: '活动数据获取失败，请重试',
            duration: 3
          })
          return
        }
        let ts = this.activityInfo.animation || 'scrollY'
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
        console.log(ps)
      }
    },
    components: {}
  }
</script>
