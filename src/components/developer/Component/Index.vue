<template>
  <div class="container">
    <div class="wrapper">
      <div class="item"
           v-for="(item, index) in renderComponents"
           :key="index">
        <div class="title">
          <div class="title_text">{{item.category}} <span class="primary_color">{{item.list.length}}</span></div>
        </div>
        <div class="content">
          <div class="no_search_result"
               v-if="item.list.length === 0">无搜索结果</div>
          <div class="card_item"
               v-for="(itm, idx) in item.list"
               :key="idx">
            <!-- :class="{'reject': (itm.status === 0 || itm.status === 2), 'inreview': (itm.status === 1), 'passed': (itm.status === 3)}" -->
            <Card class="card_item_wrapper"
                  :bordered="false">
              <p slot="title">{{itm.name}}</p>
              <p class="author">{{itm.author}}</p>
              <small>{{itm.desc}}</small>
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
      </div>
    </div>
    <Modal title="上传组件"
           v-model="createModal.shown"
           :mask-closable="false">
      <Form :label-width="80">
        <FormItem label="上传组件">
          <Upload accept="application/x-gzip,application/zip"
                  :max-size="formData.maxSize"
                  :format="formData.format"
                  :on-exceeded-size="handleMaxSize"
                  :on-format-error="handleFormatError"
                  :on-success="uploadSuccess"
                  :on-error="uploadFail"
                  :before-upload="beforeUpload"
                  :action="requestInfo.baseUrl + '/Zpm/plugin/uploadPlugin?phonenum=' + loginInfo.phonenum + '&token=' + loginInfo.token + '&ms=' + formData.maxSize + '&accept=' + formData.format.join(';')">
            <Button icon="ios-cloud-upload-outline">上传</Button>
          </Upload>
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
.container {
  width: 100%;
  height: 100%;
  font-size: 30px;
  overflow-y: auto;
  color: #333333;
  background-color: #ffffff;
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
  color: #888;
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
  background-color: #ff9900;
}
/* .card_item_wrapper.passed {
  background-color: #19be6b;
  color: #ffffff;
} */
.card_item_wrapper.reject {
  background-color: #ed3f14;
  color: #ffffff !important;
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
</style>
<script>
import * as types from '../../../store/mutation-types'
export default {
  name: 'ComponentsIndex',
  data () {
    return {
      components: [],
      formData: {
        maxSize: 5 * 1024,
        format: ['zip']
      },
      createModal: {
        shown: true,
        desc: ''
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
    renderComponents () {
      let _components = JSON.parse(JSON.stringify(this.components))
      _components.filter(item => {
        item.list = item.list.filter(itm => (itm.name.indexOf(this.componentSearch) > -1 || itm.author.indexOf(this.componentSearch) > -1))
      })
      return _components
    },
    componentSearch () {
      return this.$store.state.componentSearch
    }
  },
  created () {
    this.initComponents()
  },
  mounted () {
    this.$nextTick(() => {
      this.$store.commit(types.SET_APP_HEAER, {
        component: () => import('./HeaderSearch.vue')
      })
    })
  },
  methods: {
    showUploadModal () {
      this.createModal.shown = true
    },
    beforeUpload (file) {
      //        let _pluginName = file.name.replace(/\.[a-z0-9]+$/i, '')
      //        let _pluginIndex = this.findPluginIndexByName(_pluginName)
      //        if (Number(_pluginIndex) > -1) {
      //          // 已经存在
      //          this.$Notice.warning({
      //            title: '新增失败',
      //            desc: '插件已经存在'
      //          })
      //        }
      //        return false
      return true
    },
    findPluginIndexByName (pluginName) {
      let outPluginIndex = -1
      let allPlugins = this.allPlugins
      let i = 0
      for (i; i < allPlugins.length; i++) {
        if (allPlugins[i].name === pluginName) {
          outPluginIndex = i
          i = allPlugins.length
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
      this.$Notice.error({
        title: '文件上传失败',
        desc: file.name + '上传失败：' + event.message
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '文件太大了',
        desc: '文件' + file.name + '太大，请不要超过' + (this.formData.maxSize / 1024) + 'M'
      })
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: file.name + '格式不正确，请上传' + (this.formData.format.join(';')) + '格式的文件'
      })
    },
    initComponents (count) {
      let _c = count || 50
      let categories = ['基础组件', '导航组件', '表单组件', '视图组件', '其它组件']
      let status = [0, 1, 2, 3]
      let outComponents = []
      let _i = 0
      let _ran
      for (let i = 0; i < _c; i++) {
        _i = i % 5
        if (outComponents.length < _i + 1) {
          outComponents[_i] = {
            category: '',
            list: []
          }
        }
        _ran = Math.floor(Math.random() * 10000)
        outComponents[_i].category = categories[_i]
        outComponents[_i].list.push({
          name: 'ZpmButton' + _ran,
          author: 'ls' + i,
          desc: '描述内容' + i,
          status: status[Math.floor(Math.random() * 1000) % 4],
          category: categories[_i]
        })
      }
      this.components = outComponents
    }
  },
  watch: {
    '$route' (val) {
      if (val.name === 'ComponentIndex') {
        this.$store.commit(types.SET_APP_HEAER, {
          component: () => import('./HeaderSearch.vue')
        })
      }
    }
  }
}
</script>
