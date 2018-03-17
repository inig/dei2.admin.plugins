<template>
  <div class="user_activities_list_container">
    <div class="user_activities_list_wrapper" :ref="ActivityListRef">
      <!--<Row :gutter="10">-->
        <!--<Col></Col>-->
      <Tabs value="all-activity">
        <TabPane label="全部活动" name="all-activity">
          <div class="activity_list_row" v-for="(r, index) in rows" :key="index" :class="['activity_list_row_last_' + (index === rows - 1)]">
            <div class="new_card_container" @click="create" v-if="index === 0">
              <div class="new_card_inner">
                <Icon type="plus-round" size="40"></Icon>
              </div>
            </div>
            <activity-card v-for="(c, idx) in getCountByRow(index, rows, activityList)" :key="idx" :data-value="index === 0 ? activityList[index * cols + idx] : activityList[index * cols + idx - 1]"></activity-card>
            <div class="blank_card_container" v-for="(b, i) in getBlankCardCount(index, rows, activityList)" :key="i" v-if="((activityList.length + 1) % cols !== 0) && (index === rows - 1)">
              <div class="load_more_activity" v-if="i === 0 && pageIndex <= totalPages" @click="loadMore">
                <span>加载更多</span>
              </div>
              <div class="load_nomore_activity" v-else-if="i === 0 && pageIndex > totalPages">
                <span>已经加载完毕</span>
              </div>
              <div class="blank_card_inner" v-else></div>
            </div>
          </div>
          <div class="activity_list_row" v-if="(activityList.length + 1) % cols === 0">
            <div class="blank_card_container" v-for="(c, index) in cols" :key="index">
              <div class="load_more_activity" v-if="index === 0 && pageIndex <= totalPages" @click="loadMore">
                <span>加载更多</span>
              </div>
              <div class="load_nomore_activity" v-else-if="index === 0 && pageIndex > totalPages">
                <span>已经加载完毕</span>
              </div>
              <div class="blank_card_inner" v-else></div>
            </div>
          </div>
        </TabPane>
        <TabPane label="我的活动" name="my-activity">
          <div class="activity_list_row" v-for="(r, index) in myRows" :key="index" :class="['activity_list_row_last_' + (index === myRows - 1)]">
            <div class="new_card_container" @click="create" v-if="index === 0">
              <div class="new_card_inner">
                <Icon type="plus-round" size="40"></Icon>
              </div>
            </div>
            <activity-card v-for="(c, idx) in getCountByRow(index, myRows, myActivityList)" :key="idx" :data-value="index === 0 ? myActivityList[index * cols + idx] : myActivityList[index * cols + idx - 1]"></activity-card>
            <div class="blank_card_container" v-for="(b, i) in getBlankCardCount(index, myRows, myActivityList)" :key="i" v-if="((myActivityList.length + 1) % cols !== 0) && (index === myRows - 1)">
              <div class="load_more_activity" v-if="i === 0 && myPageIndex <= myTotalPages" @click="loadMoreMyList">
                <span>加载更多</span>
              </div>
              <div class="load_nomore_activity" v-else-if="i === 0 && myPageIndex > myTotalPages">
                <span>已经加载完毕</span>
              </div>
              <div class="blank_card_inner" v-else></div>
            </div>
          </div>
          <div class="activity_list_row" v-if="(myActivityList.length + 1) % cols === 0">
            <div class="blank_card_container" v-for="(c, index) in cols" :key="index">
              <div class="load_more_activity" v-if="index === 0 && myPageIndex <= myTotalPages" @click="loadMoreMyList">
                <span>加载更多</span>
              </div>
              <div class="load_nomore_activity" v-else-if="index === 0 && myPageIndex > myTotalPages">
                <span>已经加载完毕</span>
              </div>
              <div class="blank_card_inner" v-else></div>
            </div>
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
  .blank_card_inner {
    width: 127px;
    height: 200px;
  }
  .load_more_activity {
    width: 127px;
    height: 200px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    font-size: 14px;
    color: #888;
    opacity: 0.5;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    -webkit-transition: all .3s ease-in-out;
    -moz-transition: all .3s ease-in-out;
    -ms-transition: all .3s ease-in-out;
    -o-transition: all .3s ease-in-out;
    transition: all .3s ease-in-out;
  }
  .load_more_activity:hover {
    opacity: 1;
    -webkit-box-shadow: 0 0 7px 2px rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 0 0 7px 2px rgba(0, 0, 0, 0.2);
    box-shadow: 0 0 7px 2px rgba(0, 0, 0, 0.2);
  }
  .load_nomore_activity {
    width: 127px;
    height: 200px;
    cursor: not-allowed;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    font-size: 14px;
    color: #888;
    opacity: .5;
  }
  .new_card_container {
    float: left;
    width: 127px;
    height: 200px;
    margin-bottom: 10px;
    margin-left: 5px;
    margin-right: 5px;
    cursor: pointer;
    color: #888;
    opacity: 0.5;
    border-radius: 4px;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    -webkit-transition: all .3s ease-in-out;
    -moz-transition: all .3s ease-in-out;
    -ms-transition: all .3s ease-in-out;
    -o-transition: all .3s ease-in-out;
    transition: all .3s ease-in-out;
  }
  .new_card_inner {
    width: 127px;
    height: 200px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
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
    opacity: 1;
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
  import utils from '../../utils'
  export default {
    name: 'Activity',
    data () {
      return {
        ActivityListRef: 'ref-activity-list',
        activityList: [],
        myActivityList: [],
        pageIndex: 1,
        pageSize: 2,
        totalPages: 1, // 总页数
        totalCounts: 1, // 总条数
        myPageIndex: 1,
        myPageSize: 2,
        myTotalPages: 1, // 总页数
        myTotalCounts: 1, // 总条数
        containerWidth: 137,
        eventHub: this.$store.state.eventHub,
        events: this.$store.state.events,
        requestInfo: this.$store.state.requestInfo
      }
    },
    computed: {
      rows () {
        return Math.ceil((this.activityList.length + 1) / Math.floor(this.containerWidth / 137))
      },
      cols () {
        return Math.floor(this.containerWidth / 137)
      },
      myRows () {
        return Math.ceil((this.myActivityList.length + 1) / Math.floor(this.containerWidth / 137))
      },
      loginInfo () {
        return utils.storage.getItem(this.$store.state.localStorageKeys.userInfo)
      }
    },
    async created () {
      await this.initActivityList()
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
      async initActivityList () {
        this.pageIndex = 1
        let listData = await this.list()
        if (listData.status === 200) {
          this.activityList = listData.data.list
          this.totalPages = listData.data.total
          this.totalCounts = listData.data.totalCounts
          this.pageIndex += 1
        }
        this.myPageIndex = 1
        let myListData = await this.list({
          author: this.loginInfo.phonenum,
          pageIndex: this.myPageIndex
        })
        if (myListData.status === 200) {
          this.myActivityList = myListData.data.list
          this.myTotalPages = myListData.data.total
          this.myTotalCounts = myListData.data.totalCounts
          this.myPageIndex += 1
        }
      },
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
            params: {
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
      async list (opt) {
        // 获取所有活动列表
        let _data = {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
        if (opt && opt.author) {
          _data.author = opt.author
        }
        if (opt && opt.pageIndex) {
          _data.pageIndex = opt.pageIndex
        }
        let listData = await this.$store.dispatch(types.AJAX, {
          baseUrl: this.requestInfo.baseUrl,
          url: this.requestInfo.listActivity,
          data: _data
        })
        return listData
      },
      async loadMore () {
        let listData = await this.list()
        if (listData.status === 200) {
          this.activityList = this.activityList.concat(listData.data.list)
          this.totalPages = listData.data.total
          this.totalCounts = listData.data.totalCounts
          this.pageIndex += 1
        }
      },
      async loadMoreMyList () {
        let myListData = await this.list({
          author: this.loginInfo.phonenum,
          pageIndex: this.myPageIndex
        })
        if (myListData.status === 200) {
          this.myActivityList = this.myActivityList.concat(myListData.data.list)
          this.myTotalPages = myListData.data.total
          this.myTotalCounts = myListData.data.totalCounts
          this.myPageIndex += 1
        }
      },
      navToPage (evt) {
        this.$router.push(evt)
      },
      setContainerWidth () {
        this.$refs[this.ActivityListRef] && (this.containerWidth = this.$refs[this.ActivityListRef].getBoundingClientRect().width)
      },
      getCountByRow (r, rows, arr) {
        let _count = this.cols
        if (r === 0) {
          if (rows > 1) {
            _count = this.cols - 1
          } else {
            _count = arr.length
          }
        } else {
          if (Number(r) < rows - 1) {
            _count = this.cols
          } else if (Number(r) === rows - 1) {
            _count = (arr.length + 1 - r * this.cols)
          } else {
            _count = 0
          }
        }
        return _count
      },
      getBlankCardCount (r, rows, arr) {
        if ((arr.length + 1) % this.cols === 0) {
          return 0
        } else {
          if (Number(r) === 0) {
            return this.cols - this.getCountByRow(rows - 1, rows, arr) - 1
          } else {
            return this.cols - this.getCountByRow(rows - 1, rows, arr)
          }
        }
      }
    },
    components: {
      ActivityCard: () => import('./activity/ActivityCard.vue')
    }
  }
</script>
