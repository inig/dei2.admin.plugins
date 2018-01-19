<template>
  <div class="root_plugins_list_container">
    <div class="root_plugin_list_wrapper">
      <div class="root_plugin_list_title">
        <span class="root_plugin_list_title_text">插件管理</span>
        <Form class="root_plugin_list_filter_container" :label-width="70">
          <FormItem class="root_plugin_list_filter_item" label="插件名">
            <Input v-model="filterConditions.name" placeholder="请输入插件名" @on-enter="filterConditionsChanged"/>
          </FormItem>
          <FormItem class="root_plugin_list_filter_item" label="作者">
            <Input v-model="filterConditions.author" placeholder="请输入手机号" @on-enter="filterConditionsChanged"/>
          </FormItem>
          <FormItem label="插件状态" class="root_plugin_list_filter_item">
            <Select v-model="filterConditions.status" placeholder="请选择插件状态" @on-change="filterConditionsChanged">
              <Option :value="-1">全部</Option>
              <Option :value="0">不可用</Option>
              <Option :value="1">审核中</Option>
              <Option :value="2">已拒绝</Option>
              <Option :value="3">已通过</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
      <div class="root_plugin_list_table">
        <Table border :columns="pluginKeys" :data="plugins" :stripe="true"></Table>
        <div class="root_plugin_pages_container">
          <Page :total="totalCounts" size="small"
                :page-size="currentPage.size"
                :page-size-opts="currentPage.sizeOpts"
                show-elevator
                show-sizer
                @on-change="switchPage"
                @on-page-size-change="switchPageSize"
          ></Page>
        </div>
      </div>
    </div>
    <Modal :title="'审核插件 ' + currentPlugin.name" v-model="setPluginModal"
           ok-text="修改"
           @on-ok="modifyPlugin"
    >
      <Form :model="currentPlugin" :label-width="80">
        <FormItem label="插件状态">
          <Select v-model="currentPlugin.status">
            <Option v-for="(item, index) in allPluginStatus" :value="item.value" v-text="item.name" :key="item.value"></Option>
          </Select>
        </FormItem>
        <FormItem label="理由" v-if="currentPlugin.status !== 3 && currentPlugin.status !== 1">
          <Input v-model="currentPlugin.remarks" type="textarea" :autosize="{minRows: 1, maxRows: 5}" placeholder="请输入该插件不可用或不通过的原因"/>
        </FormItem>
      </Form>
    </Modal>
    <Modal title="删除插件" v-model="deletePluginModal"
           @on-ok="deletePlugin"
    >
      <p>删除后将无法恢复，您确定要删除 <span style="color: #ed3f14;" v-text="plugins[deletePluginIndex] && plugins[deletePluginIndex].name"></span> 吗？</p>
    </Modal>
  </div>
</template>
<style scoped>
  .root_plugins_list_container {
    width: 100%;
    height: 100%;
  }
  .root_plugin_list_wrapper {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    background-color: #ffffff;
    box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.2);
    overflow-y: auto;
  }
  .root_plugin_list_title {
    position: sticky;
    left: 0;
    top: 0;
    z-index: 999;
    width: 100%;
    height: 48px;
    font-size: 15px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #ffffff;
  }
  .root_plugin_list_title_text {
    width: 100px;
  }
  .root_plugin_list_filter_container {
    width: calc(100% - 150px);
    height: 48px;
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
  }
  .root_plugin_list_filter_item {
    width: 180px;
    margin-left: 10px;
    margin-bottom: 0;
  }
  .root_plugin_list_table {
    padding: 0 15px;
  }
  .root_plugin_pages_container {
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
<script>
  import * as types from '../../store/mutation-types'
  // import utils from '../../utils'
  import TableExpand from './TableExpand.vue'
  export default {
    name: 'plugins',
    data () {
      return {
        pluginKeys: [
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h(TableExpand, {
                props: {
                  row: params.row
                }
              })
            }
          },
          {
            title: '插件名',
            key: 'name'
          },
          {
            title: '作者',
            key: 'author'
          },
          {
            title: '上传时间',
            key: 'createTime',
            render: (h, params) => {
              return h('span', this.formatTime(params.row.createTime))
            }
          },
          {
            title: '更新时间',
            key: 'updateTime',
            render: (h, params) => {
              return h('span', this.formatTime(params.row.updateTime))
            }
          },
          {
            title: '状态',
            key: 'status',
            render: (h, params) => {
              let outText = ''
              switch (String(params.row.status)) {
                case '0':
                  outText = '不可用'
                  break
                case '1':
                  outText = '审核中'
                  break
                case '2':
                  outText = '已拒绝'
                  break
                case '3':
                  outText = '已通过'
                  break
                default:
                  break
              }
              return h('span', outText)
            }
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.setPlugin(params.index)
                    }
                  }
                }, '审核'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.confirmDeletePlugin(params.index)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        plugins: [],
        totalPages: 0,
        totalCounts: 0,
        currentPage: {
          index: 1,
          size: 2,
          sizeOpts: [1, 2, 3, 4, 5, 6]
        },
        setPluginModal: false,
        currentPluginIndex: -1,
        currentPlugin: {},
        allPluginStatus: [
          {
            value: 0,
            name: '不可用'
          },
          {
            value: 1,
            name: '审核中'
          },
          {
            value: 2,
            name: '已拒绝'
          },
          {
            value: 3,
            name: '已通过'
          }
        ],
        deletePluginModal: false,
        deletePluginIndex: -1,
        filterConditions: {
          status: -1,
          author: '',
          name: ''
        },
        socketEvents: this.$store.state.socketEvents,
        requestInfo: this.$store.state.requestInfo
      }
    },
    computed: {
      loginInfo () {
        return this.$store.state.loginInfo
      }
    },
    async created () {
      this.$nextTick(async () => {
        await this.switchPage(this.currentPage.index)
      })
    },
    methods: {
      formatTime (time) {
        /**
         * 刚刚     T <= 5 * 60 * 1000  (5分钟内)
         * 5分钟之前 5 * 60 * 10 < T <= 10 * 60 * 1000 (5-10分钟)
         * 10分钟之前 10 * 60 * 1000 < T <= 30 * 60 * 1000 (10-30分钟)
         * 半小时之前 30 * 60 * 1000 < T <= 60 * 60 *1000 (30-60分钟)
         * 1小时之前 60 * 60 * 1000 < T <= 2 * 60 * 60 * 1000 (1-2小时)
         * 今天xx时xx分xx秒
         * YYYY-MM-DD hh:mm:ss
         */
        let outText = ''
        let _nowTs = +new Date()
        let _targetTs = Number(time)
        let _todayTs = new Date(new Date().toLocaleDateString()).getTime()
        let date = new Date()
        date.setTime(time)
        let _year = date.getFullYear()
        let _month = ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1))
        let _day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
        let _hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours())
        let _minute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
        let _second = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
        if (_targetTs + 5 * 60 * 1000 >= _nowTs) {
          outText = '刚刚'
        } else if (_targetTs + 5 * 60 * 1000 < _nowTs && _targetTs + 10 * 60 * 1000 >= _nowTs) {
          outText = '5分钟之前'
        } else if (_targetTs + 10 * 60 * 1000 < _nowTs && _targetTs + 30 * 60 * 1000 >= _nowTs) {
          outText = '10分钟之前'
        } else if (_targetTs + 30 * 60 * 1000 < _nowTs && _targetTs + 60 * 60 * 1000 >= _nowTs) {
          outText = '半小时之前'
        } else if (_targetTs + 60 * 60 * 1000 < _nowTs && _targetTs + 2 * 60 * 60 * 1000 >= _nowTs) {
          outText = '1小时之前'
        } else if (_targetTs >= _todayTs) {
          outText = `今天${_hour}:${_minute}:${_second}`
        } else {
          outText = `${_year}-${_month}-${_day} ${_hour}:${_minute}:${_second}`
        }

        return outText
      },
      async getPluginList (args) {
        let _userList = await this.$store.dispatch(types.AJAX, {
          url: this.requestInfo.listAllPlugins,
          data: args
        })
        this.totalCounts = _userList.data.totalCounts
        return _userList ? _userList.data.list : []
      },
      async getPluginListByPage (args) {
        let _filterConditions = JSON.parse(JSON.stringify(this.filterConditions))
        if (Number(_filterConditions.status) === -1) {
          delete _filterConditions.status
        }
        if (_filterConditions.author.trim() === '') {
          delete _filterConditions.author
        }
        if (_filterConditions.name.trim() === '') {
          delete _filterConditions.name
        }
        this.plugins = await this.getPluginList(Object.assign({}, args, _filterConditions))
      },
      async switchPage (evt) {
        this.currentPage.index = evt
        await this.getPluginListByPage({
          pageIndex: evt,
          pageSize: this.currentPage.size
        })
      },
      async switchPageSize (evt) {
        this.currentPage.size = evt
        this.currentPage.index = 1
        await this.getPluginListByPage({
          pageIndex: this.currentPage.index,
          pageSize: this.currentPage.size
        })
      },
      setPlugin (index) {
        this.setPluginModal = true
        this.currentPluginIndex = Number(index)
        this.currentPlugin = JSON.parse(JSON.stringify(this.plugins[index]))
      },
      getStatusText (status) {
        let _status = Number(status)
        let outText = ''
        switch (_status) {
          case 0:
            outText = '不可用'
            break
          case 1:
            outText = '审核中'
            break
          case 2:
            outText = '已拒绝'
            break
          case 3:
            outText = '已通过'
            break
          default:
            break
        }
        return outText
      },
      async modifyPlugin () {
        /**
         * 修改插件的 状态
         */
        let _remarks = this.currentPlugin.remarks
        if (this.currentPlugin.status === 1 || this.currentPlugin.status === 3) {
          _remarks = ''
        }
        this.currentPlugin.remarks = _remarks
        let updatePluginData = await this.$store.dispatch(types.AJAX, {
          url: this.requestInfo.updatePluginSettings,
          data: {
            name: this.currentPlugin.name,
            status: Number(this.currentPlugin.status),
            remarks: _remarks
          }
        })
        if (updatePluginData.status === 200) {
          // 修改成功
          this.$Message.success('修改成功')
          this.$store.dispatch(types.SEND_MESSAGE, {
            to: {
              phonenum: this.currentPlugin.author,
              username: '',
              role: -1
            },
            message: {
              type: this.socketEvents.reviewPlugin,
              data: this.currentPlugin,
              title: '插件审核结果',
              value: `【${this.getStatusText(this.currentPlugin.status)}】\n${_remarks}\n${JSON.stringify(this.currentPlugin)}`
            }
          })
          await this.getPluginListByPage({
            pageIndex: this.currentPage.index,
            pageSize: this.currentPage.size
          })
        } else {
          this.$Message.error('修改失败')
        }
      },
      confirmDeletePlugin (index) {
        this.deletePluginIndex = Number(index)
        this.deletePluginModal = true
      },
      async deletePlugin () {
        /**
         * 删除用户
         */
        let deletePluginData = await this.$store.dispatch(types.AJAX, {
          url: this.requestInfo.deletePlugin,
          data: {
            name: this.plugins[this.deletePluginIndex].name
          }
        })
        if (deletePluginData.status === 200) {
          // 删除成功
          await this.getPluginListByPage({
            pageIndex: this.currentPage.index,
            pageSize: this.currentPage.size
          })
          this.$Message.success('删除成功')
        } else {
          this.$Message.error('删除失败')
        }
      },
      async filterConditionsChanged () {
        await this.getPluginListByPage({
          pageIndex: this.currentPage.index,
          pageSize: this.currentPage.size
        })
      }
    },
    components: {
      TableExpand
    }
  }
</script>
