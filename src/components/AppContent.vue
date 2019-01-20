<template>
  <div class="app_content"
       :class="{'window_full_screen': isFullScreen}">
    <Row type="flex"
         class="h100p">
      <Col :span="spanLeft">
      <app-side-menu></app-side-menu>
      </Col>
      <Col :span="spanRight">
      <app-main-content></app-main-content>
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
  height: calc(100% - 61px);
  /*border-left: 1px solid #d7dde4;*/
  /*border: 1px solid #d7dde4;*/
  /*border-top: none;*/
  box-sizing: border-box;
  overflow: hidden;
  background-color: #f5f7f9;
}
.window_full_screen {
  top: 60px !important;
  height: calc(100% - 60px) !important;
}
</style>
<script>
export default {
  name: 'AppContent',
  data () {
    return {
      appName: this.$store.state.appName,
      assets: this.$store.state.assets
    }
  },
  computed: {
    spanLeft () {
      return this.$store.state.spanLeft
    },
    spanRight () {
      return this.$store.state.spanRight
    },
    menuFold () {
      return this.$store.state.menuFold
    },
    isFullScreen () {
      return this.$store.state.isFullScreen
    }
  },
  components: {
    AppSideMenu: () => import('./AppSideMenu.vue'),
    AppMainContent: () => import('./AppMainContent.vue')
  }
}
</script>
