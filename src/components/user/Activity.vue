<template>
  <div class="user_activities_list_container">
    <div class="user_activities_list_wrapper">
      <p>活动管理页面</p>
    </div>
  </div>
</template>
<style scoped>
  .user_activities_list_container {
    width: 100%;
    height: 100%;
  }
  .user_activities_list_wrapper {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    background-color: #ffffff;
    /*box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.2);*/
    overflow-y: auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
<script>
  export default {
    name: 'Activity',
    data () {
      return {
      }
    },
    components: {}
  }
</script>
