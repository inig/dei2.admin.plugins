<template>
  <div class="container">
    <div class="no_results">无匹配结果</div>
    <div class="wrapper">
      <div class="item"
           v-for="(item, index) in renderComponents"
           :key="index"
           v-if="item.list.length > 0">
        <div class="title">
          <div class="title_text">{{item.category}} <span class="primary_color">{{item.list.length}}</span></div>
        </div>
        <div class="content">
          <!-- <div class="no_search_result"
               v-if="item.list.length === 0">无搜索结果</div> -->
          <div class="card_item"
               v-for="(itm, idx) in item.list"
               :key="idx">
            <!-- :class="{'reject': (itm.status === 0 || itm.status === 2), 'inreview': (itm.status === 1), 'passed': (itm.status === 3)}" -->
            <Card class="card_item_wrapper"
                  :class="{'reject': (itm.status === 0 || itm.status === 2), 'inreview': (itm.status === 1), 'passed': (itm.status === 3)}"
                  :data-uuid="itm.uuid"
                  @click.prevent.native="goToDetail(itm.uuid)"
                  :bordered="false">
              <p slot="title">{{itm.name}}</p>
              <p class="author">作者：{{itm.zpm_user.nickname || itm.zpm_user.username || itm.zpm_user.phonenum}}</p>
              <small class="desc">{{itm.desc}}</small>
            </Card>
          </div>
        </div>
      </div>
      <div class="right_operation">
        <Tooltip content="上传组件"
                 placement="bottom-end">
          <div class="operation_item"
               @click="showUploadModal">
            <Icon type="md-cloud-upload"
                  size="20" />
          </div>
        </Tooltip>
        <Poptip trigger="click"
                placement="bottom-end"
                width="200"
                class="user-badge">
          <Tooltip content="组件筛选"
                   placement="bottom-end">
            <div class="operation_item">
              <Icon type="ios-keypad"
                    size="20" />
            </div>
          </Tooltip>
          <div class="api"
               slot="content">
            <Card :bordered="false"
                  :padding="0">
              <div class="component_filter_container">
                <Row>
                  <Col span="8"
                       class="component_filter_item_label">
                  组件状态
                  </Col>
                  <Col span="16">
                  <Select v-model="filterModal.status"
                          :transfer="true">
                    <Option v-for="item in filterModal.allStatus"
                            :value="item.id"
                            :key="item.id">{{ item.name }}</Option>
                  </Select>
                  </Col>
                </Row>
              </div>
            </Card>
          </div>
        </Poptip>
      </div>
      <div class="description_container">
        <div class="description_item">
          <div class="description_item_left reject"></div>
          <div class="description_item_right">待审核、已拒绝</div>
        </div>
        <div class="description_item">
          <div class="description_item_left inreview"></div>
          <div class="description_item_right">审核中</div>
        </div>
        <div class="description_item">
          <div class="description_item_left passed"></div>
          <div class="description_item_right">已通过</div>
        </div>
      </div>
    </div>
    <div class="component_add_container"
         @click="showUploadModal">
      <Icon type="md-add-circle"
            size="40" />
    </div>
    <Modal title="新增组件"
           v-model="createModal.shown"
           @on-ok="submit"
           :mask-closable="false">
      <Form :label-width="80">
        <FormItem label="上传组件">
          <Upload accept="application/x-gzip,application/zip"
                  :show-upload-list="false"
                  :max-size="formData.maxSize"
                  :format="formData.format"
                  :on-exceeded-size="handleMaxSize"
                  :on-format-error="handleFormatError"
                  :on-success="uploadSuccess"
                  :on-error="uploadFail"
                  :before-upload="beforeUpload"
                  action="/">
            <div class="upload_box">
              <Button icon="ios-cloud-upload-outline">上传</Button>
              <Tooltip :content="createModal.file.name"
                       placement="bottom-start"
                       v-if="createModal.file"
                       :max-width="200">
                <p class="filename_text">{{createModal.file.name}}</p>
              </Tooltip>
            </div>
          </Upload>
        </FormItem>
        <FormItem label="组件类别">
          <Select :label-in-value="true"
                  @on-change="changeCategory">
            <Option v-for="item in allCategories"
                    :value="item.id"
                    :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="组件描述">
          <Input v-model="createModal.desc"
                 type="textarea"
                 :autosize="{minRows: 2,maxRows: 3}"
                 :maxlength="150"
                 class="noresize"
                 placeholder="请输入组件描述，最多150字" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<style scoped lang="less">
  @import "../../../assets/css/index.less";
  .pen {
    pointer-events: none;
  }
  .container {
    width: 100%;
    height: 100%;
    font-size: 30px;
    overflow-y: auto;
    color: #333333;
    background-color: #ffffff;
  }
  .no_results {
    position: absolute;
    width: 100%;
    // height: 100%;
    margin-top: 100px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    color: #999;
    font-size: 14px;
  }
  .wrapper {
    position: relative;
    width: 100%;
    padding: 0 15px;
    box-sizing: border-box;
  }
  .item {
    width: 100%;
  }
  .title {
    position: sticky;
    left: 0;
    top: 0;
    z-index: 9;
    width: 100%;
    height: 48px;
    border-bottom: 1px solid #f8f8f8;
    box-sizing: border-box;
    background-color: #ffffff;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .title_text {
    width: 100%;
    height: 16px;
    font-size: 14px;
    color: #1c2438;
    line-height: 20px;
    border-left: 4px solid @primary-color;
    padding-left: 8px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .primary_color {
    color: @primary-color;
    font-weight: bolder;
    margin-left: 10px;
  }
  .author {
    font-size: 13px;
    color: #666666;
  }
  .desc {
    color: #888;
    font-size: 13px;
  }
  .content {
    width: 100%;
    padding: 15px;
    box-sizing: border-box;
    background-color: #f5f7f9;
  }
  .card_item {
    width: 25%;
    min-width: 150px;
    max-width: 200px;
    padding: 10px;
    box-sizing: border-box;
    /* height: 80px; */
    display: inline-flex;
    flex-direction: column;
    align-items: center;
  }
  .card_item_wrapper {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    font-size: 14px;
    cursor: pointer;
  }
  .card_item_wrapper.inreview {
    border-top: 4px solid #ff9900;
  }
  .card_item_wrapper.passed {
    border-top: 4px solid #19be6b;
  }
  .card_item_wrapper.reject {
    border-top: 4px solid #ed3f14;
  }
  .no_search_result {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    color: #a0a0a0;
    font-size: 12px;
  }

  .right_operation {
    position: fixed;
    right: 15px;
    top: 61px;
    // width: 100px;
    height: 48px;
    z-index: 999;
    // border-bottom: 1px solid #f8f8f8;
    box-sizing: border-box;
    background-color: transparent;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }
  .operation_item {
    width: 32px;
    height: 48px;
    cursor: pointer;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .operation_item:hover {
    opacity: 0.7;
  }
  .operation_item i {
    color: @primary-color;
  }

  .description_container {
    position: fixed;
    right: 200px;
    top: 61px;
    width: 400px;
    height: 48px;
    z-index: 999;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }
  .description_item {
    // width: 130px;
    height: 48px;
    padding: 0 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .description_item_left {
    width: 30px;
    height: 10px;
  }
  .description_item_left.inreview {
    background-color: #ff9900;
  }
  .description_item_left.passed {
    background-color: #19be6b;
  }
  .description_item_left.reject {
    background-color: #ed3f14;
  }
  .description_item_right {
    font-size: 12px;
    color: #888;
    margin-left: 8px;
  }

  .upload_box {
    width: 400px;
    height: 32px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .filename_text {
    width: 300px;
    height: 32px;
    margin-left: 8px;
    line-height: 45px;
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .component_filter_container {
    padding: 10px 15px;
    box-sizing: border-box;
  }
  .component_filter_item_label {
    font-size: 12px;
    color: #515a6e;
    height: 32px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }

  .component_add_container {
    position: fixed;
    right: 15px;
    bottom: 15px;
    width: 64px;
    height: 64px;
    z-index: 999;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .component_add_container i {
    color: @primary-color;
  }
  .component_add_container:hover {
    opacity: 0.8;
  }
</style>
<script>
  import * as types from '../../../store/mutation-types'
  export default {
    name: 'ComponentsIndex',
    data () {
      return {
        socketEvents: this.$store.state.socketEvents,
        socket: this.$store.state.socket,
        originalComponents: [],
        // components: [],
        formData: {
          maxSize: 5 * 1024,
          format: ['zip']
        },
        allCategories: [
          {
            id: 1,
            name: '基础组件'
          },
          {
            id: 2,
            name: '导航组件'
          },
          {
            id: 3,
            name: '表单组件'
          },
          {
            id: 4,
            name: '视图组件'
          },
          {
            id: 5,
            name: '其它组件'
          }
        ],
        createModal: {
          shown: false,
          desc: '',
          category: '',
          categoryId: 0,
          file: null,
          formData: null
        },
        filterModal: {
          status: 3,
          allStatus: [
            {
              name: '全部',
              id: -1
            },
            {
              name: '待审核',
              id: 0
            },
            {
              name: '审核中',
              id: 1
            },
            {
              name: '已拒绝',
              id: 2
            },
            {
              name: '已通过',
              id: 3
            }
          ]
        }
      }
    },
    computed: {
      loginInfo () {
        return this.$store.state.loginInfo
      },
      requestInfo () {
        return this.$store.state.requestInfo
      },
      theme () {
        return this.$store.state.theme
      },
      components () {
        let _originalComponents = JSON.parse(JSON.stringify(this.originalComponents))
        let categories = this.allCategories
        let outComponents = {}
        for (let c = 0; c < categories.length; c++) {
          outComponents[String(categories[c].id)] = {
            category: decodeURIComponent(categories[c].name),
            categoryId: categories[c].id,
            list: []
          }
        }
        let tempItem
        for (let i = 0; i < _originalComponents.length; i++) {
          tempItem = _originalComponents[i]
          outComponents[String(tempItem.cid)].list.push(this.decodeObj(tempItem))
        }
        let _components = []
        for (let k in outComponents) {
          if (outComponents.hasOwnProperty(k)) {
            _components.push(outComponents[k])
          }
        }
        return _components
      },
      renderComponents () {
        let _components = JSON.parse(JSON.stringify(this.components))
        _components.filter(item => {
          item.list = item.list.filter(itm => {
            let _author = (itm.zpm_user.nickname || itm.zpm_user.username || itm.zpm_user.phonenum)
            if (this.filterModal.status < 0) {
              return (itm.name.match(new RegExp(this.componentSearch, 'i')) || _author.match(new RegExp(this.componentSearch, 'i')))
            } else {
              return ((itm.name.match(new RegExp(this.componentSearch, 'i')) || _author.match(new RegExp(this.componentSearch, 'i'))) && String(itm.status) === String(this.filterModal.status))
            }
          })
        })
        return _components
      },
      componentSearch () {
        return this.$store.state.componentSearch
      }
    },
    async created () {
      await this.listComponents().catch(err => {
        console.log('Eorror: ', err)
      })
      this.$nextTick(() => {
        !this.socket.ban && this.socket.client.on(this.socket.event, this.getNewMessage)
      })
    },
    mounted () {
      this.$nextTick(() => {
        this.$store.commit(types.SET_APP_HEAER, {
          component: () => import('./HeaderSearch.vue')
        })
      })
    },
    methods: {
      getNewMessage (args) {
        // console.log('getNewMessage: ', args)
        let _newPluginInfo = JSON.parse(JSON.stringify(args.message.data))
        let _pluginIndex = this.findPluginIndexByName(_newPluginInfo.name)
        if (args.message.type === this.socketEvents.reviewPlugin) {
          _newPluginInfo = Object.assign({}, this.originalComponents[_pluginIndex], _newPluginInfo)
          if (_pluginIndex > -1) {
            this.originalComponents.splice(_pluginIndex, 1, _newPluginInfo)
          }
          if (args.to.phonenum === this.loginInfo.phonenum) {
            if (args.message.data.status === 0 || args.message.data.status === 2) {
              this.$Notice.error({
                title: `插件${args.message.data.name}审核结果`,
                desc: `<span style="color: #ed3f14; font-weight: bolder; margin-left: -8px;">【${args.message.data.status === 0 ? '不可用' : '已拒绝'}】</span><br>${args.message.data.remarks || ''}`
              })
            } else if (args.message.data.status === 1) {
              this.$Notice.warning({
                desc: `插件${args.message.data.name}正在审核中，请耐心等待`
              })
            } else if (args.message.data.status === 3) {
              this.$Notice.success({
                title: `插件${args.message.data.name}审核结果`,
                desc: `<span style="color: #19be6b; font-weight: bolder; margin-left: -8px;">【已通过】</span>`
              })
            }
          }
        } else if (args.message.type === this.socketEvents.deletePlugin) {
          if (_pluginIndex > -1) {
            this.originalComponents.splice(_pluginIndex, 1)
          }
          if (args.to.phonenum === this.loginInfo.phonenum) {
            this.$Notice.warning(({
              desc: `插件 ${args.message.data.name} 被删除`
            }))
          }
        }
      },
      goToDetail (e) {
        this.$router.push({
          name: 'ComponentDetail',
          params: {
            uuid: e.split('-').shift()
          }
        })
      },
      decodeObj (obj) {
        for (let k in obj) {
          if (obj.hasOwnProperty(k)) {
            if (typeof obj[k] === 'string') {
              obj[k] = decodeURIComponent(obj[k])
            }
          }
        }
        return obj
      },
      showUploadModal () {
        this.createModal.shown = true
      },
      changeCategory (e) {
        this.createModal.category = e.label
        this.createModal.categoryId = e.value
      },
      appendParams (params) {
        for (let p in params) {
          if (params.hasOwnProperty(p)) {
            this.createModal.formData.append(p, encodeURIComponent(params[p]))
          }
        }
      },
      findComponentByCid (cid) {
        let _components = this.components
        let outIndex = -1
        for (let i = 0; i < _components.length; i++) {
          if (String(_components[i].categoryId) === String(cid)) {
            outIndex = i
            i = _components.length
          }
        }
        return outIndex
      },
      submit () {
        return new Promise(async (resolve) => {
          this.appendParams({
            phonenum: this.loginInfo.phonenum,
            token: this.loginInfo.token,
            ms: this.formData.maxSize,
            accept: this.formData.format.join(';'),
            desc: this.createModal.desc,
            category: this.createModal.category,
            cid: this.createModal.categoryId
          })
          let ajaxData = await this.$store.dispatch(types.AJAX3, {
            url: this.requestInfo.component.add,
            method: 'POST',
            data: this.createModal.formData
          })
          if (ajaxData.status === 200) {
            this.originalComponents.push(this.decodeObj(ajaxData.data))
            this.resetFormData()
            this.$Notice.success({
              title: '组件添加成功',
              desc: '组件<span style="font-weight: bolder; color: ' + this.theme + ';">' + ajaxData.data.name + '</span>上传成功'
            })
          } else {
            this.$Notice.error({
              title: '组件添加失败',
              desc: '组件' + (ajaxData.data.plugin ? ('<span style="font-weight: bolder; color: ' + this.theme + ';">' + ajaxData.data.name + '</span>') : '') + '上传失败' + (ajaxData.message ? '<span style="font-weight: bolder; color: ' + this.theme + ';"> :' + ajaxData.message + '</span>' : '')
            })
          }
        })
      },
      resetFile () {
        this.createModal.file = null
        this.createModal.formData = null
      },
      resetFormData () {
        this.createModal = Object.assign({}, this.createModal, {
          desc: '',
          category: '',
          categoryId: 0,
          file: null,
          formData: null
        })
      },
      beforeUpload (file) {
        // if (!this.createModal.formData) {
        //   this.createModal.formData = new FormData()
        // }
        this.createModal.formData = new FormData()
        this.createModal.formData.append('file', file)
        this.createModal.file = file
        // let _pluginName = file.name.replace(/\.[a-z0-9]+$/i, '')
        // let _pluginIndex = this.findPluginIndexByName(_pluginName)
        // if (Number(_pluginIndex) > -1) {
        //   // 已经存在
        //   this.$Notice.warning({
        //     title: '新增失败',
        //     desc: '插件已经存在'
        //   })
        // }
        return true
      },
      findPluginIndexByName (pluginName) {
        let outPluginIndex = -1
        let originalComponents = this.originalComponents
        let i = 0
        for (i; i < originalComponents.length; i++) {
          if (originalComponents[i].name === pluginName) {
            outPluginIndex = i
            i = originalComponents.length
          }
        }
        return outPluginIndex
      },
      uploadSuccess (event, file, fileList) {
        if (Number(event.status) === 200) {
          this.$Notice.success({
            title: '文件上传成功',
            desc: file.name + '上传成功'
          })
          this.eventHub.$emit(this.events.updatePluginList, {
            plugin: event.data.plugin
          })
        } else {
          this.$Notice.error({
            title: '文件上传失败',
            desc: file.name + '上传失败：' + event.message || ''
          })
          if (event.data.needLogin) {
            // 跳转至登录
            this.$router.replace('/login')
          }
        }
      },
      uploadFail (event, file, fileList) {
        // this.$Notice.error({
        //   title: '文件上传失败',
        //   desc: file.name + '上传失败：' + event.message
        // })
      },
      handleMaxSize (file) {
        this.resetFile()
        this.$Notice.warning({
          title: '文件太大了',
          desc: '文件' + file.name + '太大，请不要超过' + (this.formData.maxSize / 1024) + 'M'
        })
      },
      handleFormatError (file) {
        this.resetFile()
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: file.name + '格式不正确，请上传' + (this.formData.format.join(';')) + '格式的文件'
        })
      },
      addComponent () {

      },
      listComponents () {
        return new Promise(async (resolve, reject) => {
          let ajaxData = await this.$store.dispatch(types.AJAX, {
            url: this.requestInfo.component.list,
            method: 'POST',
            data: {}
          })
          if (ajaxData.status === 200) {
            this.originalComponents = ajaxData.data
          } else {
            this.originalComponents = []
          }
          resolve(true)
        })
      }
    },
    watch: {
      '$route' (val) {
        if (val.name === 'ComponentIndex') {
          this.$store.commit(types.SET_APP_HEAER, {
            component: () => import('./HeaderSearch.vue')
          })
        }
      },
      'createModal.shown' (val) {
        if (!val) {
          this.resetFile()
          this.resetFormData()
        }
      }
    }
  }
</script>
