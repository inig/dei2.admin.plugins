<template>
  <div class="activity_card_container">
    <div class="activity_card_inner">
      <div class="activity_preview_image_container">
        <img class="activity_preview_image" :src="assets.defaultActivity127x200">
        <div class="activity_description">
          <span>活动1</span>
        </div>
        <div class="activity_operation_container">
          <div class="activity_operations">
            <div class="activity_operation_item">
              <Tooltip content="预览" placement="right">
                <Icon type="eye" size="20"></Icon>
              </Tooltip>
            </div>
            <div class="activity_operation_item">
              <Tooltip content="编辑" placement="right">
                <Icon type="edit" size="20"></Icon>
              </Tooltip>
            </div>
            <div class="activity_operation_item RED">
              <Tooltip content="删除" placement="right">
                <Icon type="trash-a" size="22"></Icon>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
  .RED {
    color: #ff3300;
  }
  .activity_card_container {
    float: left;
    width: 127px;
    height: 200px;
    margin-bottom: 10px;
    margin-left: 5px;
    margin-right: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .activity_card_inner {
    width: 127px;
    height: 200px;
    /*border: 1px solid #f5f5f5;*/
    /*background-color: rgba(18,231,255,0.38);*/
  }
  .activity_preview_image_container {
    position: relative;
    width: 127px;
    height: 200px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 4px;
  }
  .activity_preview_image {
    width: 127px;
    /*width: 112px;*/
    height: 200px;
    /*background-color: red;*/
  }
  .activity_operation_container {
    position: absolute;
    width: 127px;
    height: 200px;
    left: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    color: #fff;
    -webkit-transform: translate(0, 100%);
    -moz-transform: translate(0, 100%);
    -ms-transform: translate(0, 100%);
    -o-transform: translate(0, 100%);
    transform: translate(0, 100%);
    opacity: 0;
    -webkit-transition: all .3s ease-in-out;
    -moz-transition: all .3s ease-in-out;
    -ms-transition: all .3s ease-in-out;
    -o-transition: all .3s ease-in-out;
    transition: all .3s ease-in-out;
  }
  .activity_preview_image_container:hover .activity_operation_container {
    opacity: 1;
    -webkit-transform: translate(0, 0%);
    -moz-transform: translate(0, 0%);
    -ms-transform: translate(0, 0%);
    -o-transform: translate(0, 0%);
    transform: translate(0, 0%);
  }
  .activity_operations {
    width: 127px;
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(73, 80, 96, .6);
  }
  .activity_operation_item {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: .7;
    -webkit-transition: all .3s ease;
    -moz-transition: all .3s ease;
    -ms-transition: all .3s ease;
    -o-transition: all .3s ease;
    transition: all .3s ease;
  }
  .activity_operation_item:hover {
    opacity: 1;
    cursor: pointer;
  }
  .activity_operation_item .ivu-tooltip-rel {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .activity_description {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 127px;
    max-height: 60px;
    font-size: 12px;
    padding: 3px 6px;
    text-align: justify;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
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
