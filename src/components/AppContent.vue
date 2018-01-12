<template>
  <div class="app_content">
    <Row type="flex" class="h100p">
      <Col :span="spanLeft">
        <app-side-menu></app-side-menu>
      </Col>
      <Col :span="spanRight">

      </Col>
    </Row>
  </div>
</template>
<style scoped>
  .h100p {
    height: 100%;
  }
  .app_content {
    position: absolute;
    top: 61px;
    left: 0;
    width: 100%;
    height: calc(100% - 62px);
    border-left: 1px solid #d7dde4;
    /*border: 1px solid #d7dde4;*/
    /*border-top: none;*/
    box-sizing: border-box;
    overflow: hidden;
  }
</style>
<script>
  export default {
    name: 'AppContent',
    data () {
      return {
        appName: this.$store.state.appName,
        assets: this.$store.state.assets,
        spanLeft: 6,
        spanRight: 18
      }
    },
    components: {
      AppSideMenu: () => import('./AppSideMenu.vue')
    }
  }
</script>
