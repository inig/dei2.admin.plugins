<template>
    <div class="admin_side_menu_container">
        <Menu theme="dark" width="auto" :active-name="activeName" @on-select="navToPage">
            <MenuItem name="Plugins">
                <Icon type="briefcase"></Icon>
                插件管理
            </MenuItem>
        </Menu>
    </div>
</template>
<style scoped>
    .admin_side_menu_container {
        width: 100%;
        height: 100%;
        background-color: transparent;
    }
</style>
<script>
  export default {
    name: 'SideMenu',
    data () {
      return {
      }
    },
    computed: {
      activeName () {
        return this.$route.name || ''
      }
    },
    methods: {
      navToPage (evt) {
        this.$router.replace(evt)
      }
    },
    components: {}
  }
</script>
