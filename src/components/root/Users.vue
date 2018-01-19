<template>
  <div class="root_users_list_container">
    <div class="root_user_list_wrapper">
      <div class="root_user_list_title">
        <span class="root_user_list_title_text">用户管理</span>
        <Form class="root_user_list_filter_container" :label-width="70">
          <FormItem class="root_user_list_filter_item" label="用户名">
            <Input v-model="filterConditions.username" placeholder="请输入用户名" @on-enter="filterConditionsChanged"/>
          </FormItem>
          <FormItem class="root_user_list_filter_item" label="手机号">
            <Input v-model="filterConditions.targetPhonenum" placeholder="请输入手机号" @on-enter="filterConditionsChanged"/>
          </FormItem>
          <FormItem label="用户状态" class="root_user_list_filter_item">
            <Select v-model="filterConditions.status" placeholder="请选择用户状态" @on-change="filterConditionsChanged">
              <Option :value="-1">全部</Option>
              <Option :value="0">无效</Option>
              <Option :value="1">有效</Option>
            </Select>
          </FormItem>
          <FormItem label="用户权限" class="root_user_list_filter_item">
            <Select v-model="filterConditions.role" placeholder="请选择用户权限" @on-change="filterConditionsChanged">
              <Option :value="-1">全部</Option>
              <Option v-for="(item, index) in allRoles" :value="item.value" v-text="item.name" :key="item.value"></Option>
            </Select>
          </FormItem>
        </Form>
      </div>
      <div class="root_user_list_table">
        <Table border :columns="userKeys" :data="users" :stripe="true"></Table>
        <div class="root_user_pages_container">
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
    <Modal :title="'设置用户 ' + currentUser.username" v-model="setUserModal"
           ok-text="修改"
           @on-ok="modifyUser"
    >
      <Form :model="currentUser" :label-width="80">
        <FormItem label="用户状态">
          <i-switch :value="currentUser.status == 1" size="small" @on-change="changeCurrentUserStatus">
          </i-switch>
        </FormItem>
        <FormItem label="用户权限">
          <Select v-model="currentUser.role">
            <Option v-for="(item, index) in allRoles" :value="item.value" v-text="item.name" :key="item.value"></Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <Modal title="删除用户" v-model="deleteUserModal"
           @on-ok="deleteUser"
    >
      <p>删除后将无法恢复，您确定要删除 <span style="color: #ed3f14;" v-text="users[deleteUserIndex] && (users[deleteUserIndex].username || users[deleteUserIndex].phonenum)"></span> 吗？</p>
    </Modal>
  </div>
</template>
<style scoped>
  .root_users_list_container {
    width: 100%;
    height: 100%;
  }
  .root_user_list_wrapper {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    background-color: #ffffff;
    box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.2);
    overflow-y: auto;
  }
  .root_user_list_title {
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
  .root_user_list_title_text {
    width: 100px;
  }
  .root_user_list_filter_container {
    width: calc(100% - 150px);
    height: 48px;
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
  }
  .root_user_list_filter_item {
    width: 180px;
    margin-left: 10px;
    margin-bottom: 0;
  }
  .root_user_list_table {
    padding: 0 15px;
  }
  .root_user_pages_container {
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
  export default {
    name: 'Users',
    data () {
      return {
        userKeys: [
          {
            title: '用户名',
            key: 'username',
            width: 100,
            fixed: 'left'
          },
          {
            title: '手机号',
            key: 'phonenum',
            width: 120
          },
          {
            title: '角色',
            key: 'role',
            width: 100,
            render: (h, params) => {
              let _roleText = ''
              let _role = String(params.row.role)
              switch (_role) {
                case '1':
                  _roleText = '超级管理员'
                  break
                case '2':
                  _roleText = '管理员'
                  break
                case '3':
                  _roleText = '开发者'
                  break
                case '4':
                  _roleText = '普通用户'
                  break
                default:
                  break
              }
              return h('span', _roleText)
            }
          },
          {
            title: '昵称',
            key: 'nickname',
            width: 100
          },
          {
            title: '性别',
            key: 'gender',
            width: 80,
            render: (h, params) => {
              return h('span', Number(params.row.gender) === 1 ? '男' : '女')
            }
          },
          {
            title: '上次登录时间',
            key: 'lastLoginTime',
            width: 150,
            render: (h, params) => {
              let _date = new Date()
              _date.setTime(params.row.lastLoginTime)
              let _year = _date.getFullYear()
              let _month = (_date.getMonth() + 1 < 10 ? '0' + (_date.getMonth() + 1) : (_date.getMonth() + 1))
              let _day = (_date.getDate() < 10 ? '0' + _date.getDate() : _date.getDate())
              let _hour = (_date.getHours() < 10 ? '0' + _date.getHours() : _date.getHours())
              let _minute = (_date.getMinutes() < 10 ? '0' + _date.getMinutes() : _date.getMinutes())
              let _second = (_date.getSeconds() < 10 ? '0' + _date.getSeconds() : _date.getSeconds())
              return h('span', _year + '-' + _month + '-' + _day + ' ' + _hour + ':' + _minute + ':' + _second)
            }
          },
          {
            title: '头像',
            key: 'headIcon',
            width: 200
          },
          {
            title: '状态',
            key: 'status',
            width: 80,
            fixed: 'right',
            render: (h, params) => {
              return h('span', (params.row.status === 1) ? '有效' : '无效')
            }
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
            align: 'center',
            fixed: 'right',
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
                      this.setUser(params.index)
                    }
                  }
                }, '设置'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.confirmDeleteUser(params.index)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        users: [],
        totalPages: 0,
        totalCounts: 0,
        currentPage: {
          index: 1,
          size: 2,
          sizeOpts: [1, 2, 3, 4, 5, 6]
        },
        setUserModal: false,
        currentUserIndex: -1,
        currentUser: {},
        allRoles: this.$store.state.allRoles,
        deleteUserModal: false,
        deleteUserIndex: -1,
        filterConditions: {
          role: -1,
          status: -1,
          targetPhonenum: '',
          username: ''
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
      async getUserList (args) {
        let _userList = await this.$store.dispatch(types.AJAX, {
          url: this.requestInfo.listUsers,
          data: args
        })
        this.totalCounts = _userList.data.totalCounts
        return _userList ? _userList.data.list : []
      },
      async getUserListByPage (args) {
        let _filterConditions = JSON.parse(JSON.stringify(this.filterConditions))
        if (Number(_filterConditions.status) === -1) {
          delete _filterConditions.status
        }
        if (Number(_filterConditions.role) === -1) {
          delete _filterConditions.role
        }
        if (_filterConditions.targetPhonenum.trim() === '') {
          delete _filterConditions.targetPhonenum
        }
        if (_filterConditions.username.trim() === '') {
          delete _filterConditions.username
        }
        this.users = await this.getUserList(Object.assign({}, args, _filterConditions))
      },
      async switchPage (evt) {
        this.currentPage.index = evt
        await this.getUserListByPage({
          pageIndex: evt,
          pageSize: this.currentPage.size
        })
      },
      async switchPageSize (evt) {
        this.currentPage.size = evt
        this.currentPage.index = 1
        await this.getUserListByPage({
          pageIndex: this.currentPage.index,
          pageSize: this.currentPage.size
        })
      },
      setUser (index) {
        this.setUserModal = true
        this.currentUserIndex = Number(index)
        this.currentUser = JSON.parse(JSON.stringify(this.users[index]))
      },
      changeCurrentUserStatus (evt) {
        this.currentUser.status = (evt ? 1 : 0)
      },
      getUserRoleText (role) {
        let _roleText = ''
        switch (String(role)) {
          case '1':
            _roleText = '超级管理员'
            break
          case '2':
            _roleText = '管理员'
            break
          case '3':
            _roleText = '开发者'
            break
          case '4':
            _roleText = '普通用户'
            break
          default:
            break
        }
        return _roleText
      },
      async modifyUser () {
        /**
         * 修改用户的  状态 权限
         */
        let updateUserData = await this.$store.dispatch(types.AJAX, {
          url: this.requestInfo.updateUserSettings,
          data: {
            targetPhonenum: this.currentUser.phonenum,
            status: Number(this.currentUser.status),
            role: Number(this.currentUser.role)
          }
        })
        if (updateUserData.status === 200) {
          // 修改成功
          this.$Message.success('修改成功')
          this.$store.dispatch(types.SEND_MESSAGE, {
            to: {
              phonenum: this.currentUser.phonenum,
              username: this.currentUser.username,
              role: this.currentUser.role
            },
            message: {
              type: this.socketEvents.changeUserRole,
              data: this.currentUser,
              title: '账号权限变更',
              value: `您的账号权限变为【${this.getUserRoleText(this.currentUser.role)}】`
            }
          })
          await this.getUserListByPage({
            pageIndex: this.currentPage.index,
            pageSize: this.currentPage.size
          })
        } else {
          this.$Message.error('修改失败')
        }
      },
      confirmDeleteUser (index) {
        this.deleteUserIndex = Number(index)
        this.deleteUserModal = true
      },
      async deleteUser () {
        /**
         * 删除用户
         */
        let deleteUserData = await this.$store.dispatch(types.AJAX, {
          url: this.requestInfo.deleteUser,
          data: {
            targetPhonenum: this.users[this.deleteUserIndex].phonenum
          }
        })
        if (deleteUserData.status === 200) {
          // 删除成功
          await this.getUserListByPage({
            pageIndex: this.currentPage.index,
            pageSize: this.currentPage.size
          })
          this.$Message.success('删除成功')
        } else {
          this.$Message.error('删除失败')
        }
      },
      async filterConditionsChanged () {
        await this.getUserListByPage({
          pageIndex: this.currentPage.index,
          pageSize: this.currentPage.size
        })
      }
    },
    components: {}
  }
</script>
