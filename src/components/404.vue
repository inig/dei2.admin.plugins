<template>
    <transition name="router-transition"
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut"
    >
        <div class="not_found_container">
            404 Not Found
            <Button type="info" @click="back">返回</Button>
        </div>
    </transition>
</template>
<style>
    .not_found_container {
        width: 100%;
        height: 100%;
        background-color: #42b983;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
<script>
  export default {
    name: 'NotFound',
    data () {
      return {
      }
    },
    methods: {
      back () {
        this.$router.back()
      }
    },
    created () {
      console.log(this.$router)
    },
    components: {}
  }
</script>
