<template>
  <div class="app_side_menu_container">
    <component :is="currentSideMenu"></component>
  </div>
</template>
<style scoped>
  .app_side_menu_container {
    width: 100%;
    height: 100%;
    background-color: #464c5b;
  }
</style>
<script>
  import utils from '../utils'
  export default {
    name: 'AppSideMenu',
    data () {
      return {
      }
    },
    computed: {
      loginInfo () {
        return utils.storage.getItem(this.$store.state.localStorageKeys.userInfo)
      },
      currentSideMenu () {
        let _role = this.loginInfo.role
        let _currentSideMenu = ''
        switch (_role) {
          case 1:
            _currentSideMenu = 'RootSideMenu'
            break
          case 2:
            _currentSideMenu = 'AdminSideMenu'
            break
          case 3:
            _currentSideMenu = 'DeveloperSideMenu'
            break
          case 4:
            _currentSideMenu = 'UserSideMenu'
            break
          default:
            break
        }
        return _currentSideMenu
      }
    },
    components: {
      RootSideMenu: () => import('./root/SideMenu.vue')
    }
  }
</script>
