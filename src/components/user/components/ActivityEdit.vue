<template>
  <div class="activity_edit_container"></div>
</template>
<style scoped>
  .activity_edit_container {
    width: 100%;
    height: 100%;
    background-color: rgba(18,231,255,0.38);
  }
</style>
<script>
  import * as types from '../../../store/mutation-types'
  export default {
    name: 'ActivityEdit',
    data () {
      return {
      }
    },
    mounted () {
      this.$store.commit(types.FOLD_SIDE_MENU, {
        fold: true
      })
    },
    components: {}
  }
</script>
