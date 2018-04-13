<template>
  <div class="article_header_container">
    <div class="article_header_top">
      <img class="article_header_top_logo" :src="assets.inigLogo">
    </div>
  </div>
</template>
<style scoped>
  .article_header_container {
    width: 100%;
    height: 64px;
  }
  .article_header_top {
    width: 100%;
    height: 64px;
    background-color: #ffffff;
    border-bottom: 1px solid #f5f5f5;
    box-sizing: border-box;
    -webkit-box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
    box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
  }
  .article_header_top_logo {
    height: 56px;
    margin-top: 4px;
    margin-left: 20px;
  }
</style>
<script>
  export default {
    name: 'FrontArticleHeader',
    data () {
      return {
        assets: this.$store.state.assets
      }
    },
    components: {}
  }
</script>
