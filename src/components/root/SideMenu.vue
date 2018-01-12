<template>
    <div class="root_side_menu_container">
        <Menu theme="dark" width="auto">
            <MenuItem name="user">
                <Icon type="ios-people"></Icon>
                用户管理
            </MenuItem>
        </Menu>
    </div>
</template>
<style scoped>
    .root_side_menu_container {
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
    components: {}
  }
</script>
