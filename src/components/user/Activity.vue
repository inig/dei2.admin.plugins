<template>
  <div class="user_activities_list_container">
    <div class="user_activities_list_wrapper">
      <Row :gutter="10">
        <!--<Col></Col>-->
        <Col :xs="24" :sm="8" :md="6" :lg="4" v-for="(item, index) in count" :key="index">
          <activity-card></activity-card>
        </Col>
      </Row>
    </div>
  </div>
</template>
<style scoped>
  .user_activities_list_container {
    width: 100%;
    height: 100%;
    padding: 20px;
  }
  .user_activities_list_wrapper {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    background-color: #ffffff;
    /*box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.2);*/
    overflow-y: auto;
    padding: 10px 0;
    /*display: flex;*/
    /*align-items: center;*/
    /*justify-content: center;*/
  }
</style>
<script>
  export default {
    name: 'Activity',
    data () {
      return {
        count: 10
      }
    },
    components: {
      ActivityCard: () => import('./components/ActivityCard.vue')
    }
  }
</script>
