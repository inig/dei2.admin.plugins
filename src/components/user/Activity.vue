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
        requestInfo: this.$store.state.requestInfo,
        blankActivityTemplate: {
          'animation': 'slideUp',
          'pages': [
            {
              'type': 'zpm-page',
              'uuid': utils.getUUID('zpm-page-'),
              'style': {
                'background-color': '#FFFFFF'
              },
              'children': []
            }
          ]
        }
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
        // {"animation":"scrollCoverReverseY","pages":[{"type":"zpm-page","uuid":"zpm-page-6d843cbf-e285-0b0b-7b59-7d209c5b8dd8","style":{"background-color":"#FFFFFF","background-image":"url(\"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1521630180178&di=d6d0c659f2f125041b5447fa95613102&imgtype=0&src=http%3A%2F%2Fimg4.duitang.com%2Fuploads%2Fitem%2F201508%2F04%2F20150804124522_kRV4f.jpeg\")"},"children":[]},{"type":"zpm-page","uuid":"zpm-page-6d843cbf-e285-0b0b-7b59-7d20s2dkadd8","style":{"background-color":"","children":[],"background-image":"url(\"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1521630249412&di=a60dc9159fb7fd6006da3148fcfddb20&imgtype=0&src=http%3A%2F%2Fimage1.xyzs.com%2Fupload%2F5d%2F89%2F1447467777674904%2F20151116%2F144761755190107_0.jpg\")"}},{"type":"zpm-page","uuid":"zpm-page-6d841231-e285-0b0b-7b59-7d20s2dkadd8","style":{"background-color":"","children":[],"background-image":"url(\"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1521630249412&di=0f542d68b2600bcf1fe4e6d47ab85105&imgtype=0&src=http%3A%2F%2Fimage3.xyzs.com%2Fupload%2F0d%2F08%2F929%2F20141204%2F141769387874679_0.jpg\")"}},{"type":"zpm-page","uuid":"zpm-page-6d84as2df-e285-0b0b-7b59-7d20s2dkadd8","style":{"background-color":"","children":[],"background-image":"url(\"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1521630249412&di=7808893c3d9c75c4ed170d132c47c47e&imgtype=0&src=http%3A%2F%2Fimg.mp.sohu.com%2Fupload%2F20170524%2Fd37b1e8c27f44a1db8a387ce447ef995_th.png\")"}},{"type":"zpm-page","uuid":"zpm-page-6d842211-e285-0b0b-7b59-7d20s2dkadd8","style":{"background-color":"","children":[],"background-image":"url(\"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1521630249396&di=a7298034ed5fb5836e7507f99dd46ba8&imgtype=0&src=http%3A%2F%2Fimg.mp.sohu.com%2Fupload%2F20170524%2F833073f34ac5481db193e1b2c7d85420_th.png\")"}},{"type":"zpm-page","uuid":"zpm-page-6d8423sa-e285-0b0b-7b59-7d20s2dkadd8","style":{"background-color":"","children":[],"background-image":"url(\"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1521630343939&di=056b19a34065568f98a8c48ace858b88&imgtype=0&src=http%3A%2F%2Fimg.mp.sohu.com%2Fupload%2F20170607%2F3ea3731199f3478dad6be43e9b2e6e44_th.png\")"}},{"type":"zpm-page","uuid":"zpm-page-6d841s3f-e285-0b0b-7b59-7d20sasdfd8","style":{"background-color":"","children":[],"background-image":"url(\"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1521630473181&di=6094f2f054f38e3f88d22d41909a6984&imgtype=0&src=http%3A%2F%2Fd.paper.i4.cn%2Fmax%2F2016%2F12%2F27%2F11%2F1482807879036_147259.jpg\")"}},{"type":"zpm-page","uuid":"zpm-page-6d8412dd-e285-0b0b-7b59-7d20a22fsdadd8","style":{"background-color":"","children":[],"background-image":"url(\"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1521630473180&di=e63fa0b47738de0ee78d304de4e8b24a&imgtype=0&src=http%3A%2F%2Fimage4.xyzs.com%2Fupload%2F93%2Fd6%2F1022%2F20141204%2F141769314329705_0.jpg\")"}},{"type":"zpm-page","uuid":"zpm-page-6d8adf22dd-e285-0b0b-7b59-7d20s2dkadd8","style":{"background-color":"","children":[],"background-image":"url(\"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1521630603043&di=fd00114ac4dee570056916fe5ea84572&imgtype=0&src=http%3A%2F%2Fimg1.spc365.com%2Fattachment%2Fqb_2shou_%2F4%2F20171017%2F66173_20171017111036_bxwy0.jpg\")"}},{"type":"zpm-page","uuid":"zpm-page-6d8412dd-e285-0b0b-7b59-7d20sasdf23fd8","style":{"background-color":"","children":[],"background-image":"url(\"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1521630671463&di=71c0a504f03699fc555d80bb54959ca1&imgtype=jpg&src=http%3A%2F%2Fimg1.imgtn.bdimg.com%2Fit%2Fu%3D3531682621%2C2344698572%26fm%3D214%26gp%3D0.jpg\")"}},{"type":"zpm-page","uuid":"zpm-page-6d84111123-e285-0b0b-7b59-7d20s2dkadd8","style":{"background-color":"","children":[],"background-image":"url(\"https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3793322504,3702892293&fm=27&gp=0.jpg\")"}},{"type":"zpm-page","uuid":"zpm-page-6d8412dd-e285-0b0b-7b59-7d2asdf232332dd8","style":{"background-color":"","children":[],"background-image":"url(\"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1521630473180&di=187b8188cb436f81a4f507dc3c8de422&imgtype=0&src=http%3A%2F%2Fimg.mp.sohu.com%2Fupload%2F20170608%2Fc559496c74e142a69630a595d98965aa_th.png\")"}}]}
        let createData = await this.$store.dispatch(types.AJAX, {
          baseUrl: this.requestInfo.baseUrl,
          url: this.requestInfo.createActivity,
          data: {
            thumbnail: 'https://static.dei2.com/plugins_admin/img/127x200.png',
            desc: '我的第一个活动',
            data: JSON.stringify(this.blankActivityTemplate)
          }
        })
        if (createData.status === 200) {
          this.$router.push({
            name: 'ActivityEdit',
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
