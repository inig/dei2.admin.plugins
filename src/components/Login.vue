<template>
    <div class="login_container">
        登录页面
        <Button type="primary" @click="goTo">Go To 404</Button>
    </div>
</template>
<style>
    .login_container {
        width: 100%;
        height: 100%;
        background-color: lightblue;
    }
</style>
<script>
  export default {
    name: 'Login',
    data () {
      return {
        msg: 'hello vue'
      }
    },
    methods: {
      goTo () {
        this.$router.push('/ss')
      }
    },
    components: {}
  }
</script>
