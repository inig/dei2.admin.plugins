<template>
    <div class="main_content_container">
        <!--<iframe src="http://open.iqiyi.com/developer/player_js/coopPlayerIndex.html?vid=5f28e8e45cccae190d01d2c6d4752189&tvId=6284373009&accessToken=2.f22860a2479ad60d8da7697274de9346&appKey=3955c3425820435e86d0f4cdfe56f5e7&appId=1368&height=100%&width=100%" frameborder="0" allowfullscreen="true" width="100%" height="100%"></iframe>-->
        <video class="main_content_video" :src="resourceUrl" autoplay controls></video>
    </div>
</template>
<style scoped>
    .main_content_container {
        width: 100%;
        height: 100%;
        background-color: #000000;
    }
    .main_content_video {
        width: 100%;
        height: 100%;
    }
</style>
<script>
  export default {
    name: 'MainContent',
    data () {
      return {
//        resourceUrl: 'https://v.douyu.com/show/ByVmjvBJYQ6vqkNb'
//        resourceUrl: 'http://godsong.bs2dl.yy.com/dmJkMmEyZTFlNmMyMzg3YzQ4YzcwMWFiNDY4YjBmMDgwMTc2MTMxNjIyOG1j'
        resourceUrl: 'http://hc.yinyuetai.com/uploads/videos/common/11F7015986558CF69A397108877633A7.mp4?sc=b210a88d4bc6863b'
//        resourceUrl: 'http://hd.yinyuetai.com/uploads/videos/common/147E015FEB4ADB9A9375BFDEAE157BC4.mp4?sc=501b5ed6b1566f67'
      }
    },
    components: {}
  }
</script>
