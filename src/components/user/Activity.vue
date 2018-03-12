<template>
  <div class="user_activities_list_container">
    <div class="user_activities_list_wrapper" :ref="ActivityListRef">
      <!--<Row :gutter="10">-->
        <!--<Col></Col>-->
      <Tabs value="all-activity">
        <TabPane label="全部活动" name="all-activity">
          <div class="activity_list_row" v-for="(r, index) in rows" :key="index" :class="['activity_list_row_last_' + (index === rows - 1)]">
            <div class="new_card_container" @click="create" v-if="index === 0">
              <Icon type="plus-round" size="40"></Icon>
            </div>
            <activity-card v-for="(c, idx) in getCountByRow(index)" :key="idx"></activity-card>
            <div class="blank_card_container" v-for="(b, i) in blankCardCount" :key="i" v-if="((count + 1) % cols !== 0) && (index === rows - 1)"></div>
          </div>
        </TabPane>
        <TabPane label="我的活动" name="my-activity">
          <div class="activity_list_row" v-for="(r, index) in rows" :key="index" :class="['activity_list_row_last_' + (index === rows - 1)]">
            <div class="new_card_container" v-if="index === 0">
              <Icon type="plus-round" size="40"></Icon>
            </div>
            <activity-card v-for="(c, idx) in getCountByRow(index)" :key="idx"></activity-card>
            <div class="blank_card_container" v-for="(b, i) in blankCardCount" :key="i" v-if="((count + 1) % cols !== 0) && (index === rows - 1)"></div>
          </div>
        </TabPane>
      </Tabs>
      <!--</Row>-->
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
    overflow-x: hidden;
    overflow-y: auto;
    padding: 10px 0;
  }
  .user_activities_list_wrapper .ivu-tabs {
    overflow: unset;
  }
  .activity_list_row {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
  .blank_card_container {
    float: left;
    width: 127px;
    height: 200px;
    margin-bottom: 10px;
    margin-left: 5px;
    margin-right: 5px;
  }
  .new_card_container {
    float: left;
    width: 127px;
    height: 200px;
    margin-bottom: 10px;
    margin-left: 5px;
    margin-right: 5px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    color: #888;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    -webkit-transition: all .3s ease-in-out;
    -moz-transition: all .3s ease-in-out;
    -ms-transition: all .3s ease-in-out;
    -o-transition: all .3s ease-in-out;
    transition: all .3s ease-in-out;
  }
  .new_card_container i {
    -webkit-transform: translate(0, 0);
    -moz-transform: translate(0, 0);
    -ms-transform: translate(0, 0);
    -o-transform: translate(0, 0);
    transform: translate(0, 0);
    -webkit-transition: all .3s ease-in-out;
    -moz-transition: all .3s ease-in-out;
    -ms-transition: all .3s ease-in-out;
    -o-transition: all .3s ease-in-out;
    transition: all .3s ease-in-out;
  }
  .new_card_container:hover {
    -webkit-box-shadow: 0 0 7px 2px rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 0 0 7px 2px rgba(0, 0, 0, 0.2);
    box-shadow: 0 0 7px 2px rgba(0, 0, 0, 0.2);
  }
  .new_card_container:hover i {
    -webkit-transform: translate(0, 1px);
    -moz-transform: translate(0, 1px);
    -ms-transform: translate(0, 1px);
    -o-transform: translate(0, 1px);
    transform: translate(0, 1px);
  }
</style>
<script>
  import * as types from '../../store/mutation-types'
  export default {
    name: 'Activity',
    data () {
      return {
        ActivityListRef: 'ref-activity-list',
        count: 10,
        containerWidth: 137,
        eventHub: this.$store.state.eventHub,
        events: this.$store.state.events,
        requestInfo: this.$store.state.requestInfo
      }
    },
    computed: {
      rows () {
        return Math.ceil((this.count + 1) / Math.floor(this.containerWidth / 137))
      },
      cols () {
        return Math.floor(this.containerWidth / 137)
      },
      blankCardCount () {
        if ((this.count + 1) % this.cols === 0) {
          return 0
        } else {
          return this.cols - this.getCountByRow(this.rows - 1)
        }
      }
    },
    mounted () {
      const that = this
      that.setContainerWidth()
      window.onresize = function () {
        that.setContainerWidth()
      }
      that.eventHub.$on(that.events.mainContentSizeChange, that.setContainerWidth)
    },
    methods: {
      async create () {
        // 新建活动
        let createData = await this.$store.dispatch(types.AJAX, {
          baseUrl: this.requestInfo.baseUrl,
          url: this.requestInfo.createActivity,
          data: {
            thumbnail: 'https://static.dei2.com/plugins_admin/img/127x200.png',
            desc: '我的第一个活动'
          }
        })
        if (createData.status === 200) {
          this.$router.push({
            path: 'edit',
            query: {
              q: createData.data.uuid
            }
          })
        } else {
          this.$Message.error({
            content: createData.message || '新建活动失败，请重试',
            duration: 3
          })
        }
      },
      navToPage (evt) {
        this.$router.push(evt)
      },
      setContainerWidth (e) {
        this.$refs[this.ActivityListRef] && (this.containerWidth = this.$refs[this.ActivityListRef].getBoundingClientRect().width)
      },
      getCountByRow (r) {
        let _count = this.cols
        if (r === 0) {
          _count = this.cols - 1
        } else {
          if (Number(r) < this.rows - 1) {
            _count = this.cols
          } else if (Number(r) === this.rows - 1) {
            _count = (this.count + 1 - r * this.cols)
          } else {
            _count = 0
          }
        }
        return _count
      }
    },
    components: {
      ActivityCard: () => import('./components/ActivityCard.vue')
    }
  }
</script>
