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
  import utils from '../utils'
  export default {
    name: 'AppMainContent',
    data () {
      return {
      }
    },
    computed: {
      loginInfo () {
        return utils.storage.getItem(this.$store.state.localStorageKeys.userInfo)
      },
      currentMainContent () {
        let _role = this.loginInfo.role
        let _currentMainContent = ''
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
        return _currentMainContent
      }
    },
    components: {
      RootMainContent: () => import('./root/MainContent.vue')
    }
  }
</script>
