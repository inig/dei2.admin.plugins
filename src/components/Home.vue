<template>
    <component :is="currentHome"></component>
</template>
<style>

</style>
<script>
  import utils from '../utils'
  export default {
    name: 'Home',
    data () {
      return {}
    },
    computed: {
      loginInfo () {
        return utils.storage.getItem(this.$store.state.localStorageKeys.userInfo)
      },
      currentHome () {
        let _role = this.loginInfo.role
        let _currentHome = ''
        switch (_role) {
          case 1:
            _currentHome = 'RootHome'
            break
          case 2:
            _currentHome = 'AdminHome'
            break
          case 3:
            _currentHome = 'DeveloperHome'
            break
          case 4:
            _currentHome = 'UserHome'
            break
          default:
            break
        }
        return _currentHome
      }
    },
    components: {
      RootHome: () => import('./root/Home.vue'),
      AdminHome: () => import('./admin/Home.vue'),
      DeveloperHome: () => import('./developer/Home.vue'),
      UserHome: () => import('./user/Home.vue')
    }
  }
</script>
