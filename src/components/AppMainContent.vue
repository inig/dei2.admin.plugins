<template>
  <div class="app_main_content_container">
    <component :is="currentMainContent"></component>
  </div>
</template>
<style scoped>
  .app_main_content_container {
    width: 100%;
    height: 100%;
    background-color: transparent;
  }
</style>
<script>
  // import utils from '../utils'
  export default {
    name: 'AppMainContent',
    data () {
      return {
        showBlankContent: true
      }
    },
    computed: {
      loginInfo () {
        return this.$store.state.loginInfo
      },
      currentMainContent () {
        let _role = this.loginInfo.role
        let _currentMainContent = ''
        if (this.showBlankContent) {
          _currentMainContent = 'AppMainContentBlank'
        } else {
          switch (_role) {
            case 1:
              _currentMainContent = 'RootMainContent'
              break
            case 2:
              _currentMainContent = 'AdminMainContent'
              break
            case 3:
              _currentMainContent = 'DeveloperMainContent'
              break
            case 4:
              _currentMainContent = 'UserMainContent'
              break
            default:
              break
          }
        }
        return _currentMainContent
      }
    },
    created () {
      this.showBlankContent = (this.$route.path === '/')
    },
    components: {
      AppMainContentBlank: () => import('./AppMainContentBlank.vue'),
      RootMainContent: () => import('./root/MainContent.vue'),
      AdminMainContent: () => import('./admin/MainContent.vue'),
      DeveloperMainContent: () => import('./developer/MainContent.vue'),
      UserMainContent: () => import('./user/MainContent.vue')
    },
    watch: {
      '$route': function (value) {
        this.showBlankContent = (this.$route.path === '/')
      }
    }
  }
</script>
