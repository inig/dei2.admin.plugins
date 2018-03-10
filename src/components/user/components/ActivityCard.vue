<template>
  <div class="activity_card_container">
    <div class="activity_card_inner">
      <div class="activity_preview_image_container">
        <img class="activity_preview_image" :src="assets.defaultActivity" alt="">
      </div>
    </div>
  </div>
</template>
<style scoped>
  .activity_card_container {
    width: 100%;
    height: 100%;
    min-height: 200px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .activity_card_inner {
    width: 90%;
    max-width: 180px;
    height: 200px;
    border: 1px solid #f5f5f5;
    /*background-color: rgba(18,231,255,0.38);*/
  }
  .activity_preview_image_container {
    width: 100%;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .activity_preview_image {
    width: 73px;
    height: 130px;
    /*background-color: red;*/
  }
</style>
<script>
  export default {
    name: 'ActivityCard',
    data () {
      return {
        assets: this.$store.state.assets
      }
    },
    methods: {
      getDefaultImage (width, height, text, color, bgColor) {
        let _url = 'http://iph.href.lu/' + width + 'x' + height + '?'
        let _urlArr = []
        text && _urlArr.push('text=' + text)
        color && _urlArr.push('fg=' + color.substring(1))
        bgColor && _urlArr.push('bg=' + bgColor.substring(1))
        return _url + _urlArr.join('&')
      }
    },
    components: {}
  }
</script>
