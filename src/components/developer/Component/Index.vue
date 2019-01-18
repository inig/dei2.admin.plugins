<template>
  <div class="container">
    <div class="wrapper">
      <div class="item"
           v-for="(item, index) in components"
           :key="index">
        <div class="title">{{item.category}}</div>
        <div class="content">
          <div class="card_item"
               v-for="(itm, idx) in item.list"
               :key="idx">
            <Card class="card_item_wrapper"
                  :class="{'reject': (itm.status === 0 || itm.status === 2), 'inreview': (itm.status === 1), 'passed': (itm.status === 3)}"
                  :bordered="false">
              <p slot="title">{{itm.name}}</p>
              <small>{{itm.desc}}</small>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
  width: 100%;
  height: 100%;
  font-size: 30px;
  overflow-y: auto;
  color: #333333;
  background-color: #ffffff;
}
.wrapper {
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
  font-size: 13px;
  color: #1c2438;
  border-bottom: 1px solid #f8f8f8;
  box-sizing: border-box;
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  align-items: center;
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
/* .card_item_wrapper.inreview {
  background-color: #ff9900;
}
.card_item_wrapper.passed {
  background-color: #19be6b;
  color: #ffffff;
}
.card_item_wrapper.reject {
  background-color: #ed3f14;
  color: #ffffff !important;
} */
</style>
<script>
export default {
  name: 'ComponentsIndex',
  data () {
    return {
      components: []
    }
  },
  computed: {
    renderComponents () {
      // let _components = JSON.parse(JSON.stringify(this.components))
      // _components
    }
  },
  created () {
    this.initComponents()
  },
  methods: {
    initComponents (count) {
      let _c = count || 50
      let categories = ['基础组件', '导航组件', '表单组件', '视图组件', '其它组件']
      let status = [0, 1, 2, 3]
      let outComponents = []
      let _i = 0
      console.log(JSON.stringify(outComponents, null, 2))
      for (let i = 0; i < _c; i++) {
        _i = i % 5
        if (outComponents.length < _i + 1) {
          outComponents[_i] = {
            category: '',
            list: []
          }
        }
        /**
         * case '0':
          // 不可用
          outText = '不可用'
          break
        case '1':
          // 已经提交审核
          outText = '审核中'
          break
        case '2':
          // 已拒绝
          outText = '已拒绝'
          break
        case '3':
          outText = '已通过'
          break
         */
        outComponents[_i].category = categories[_i]
        outComponents[_i].list.push({
          name: 'ZpmButtonZpmButton' + i,
          author: 'ls' + i,
          desc: '描述内容' + i,
          status: status[Math.floor(Math.random() * 1000) % 4],
          category: categories[_i]
        })
      }
      this.components = outComponents
    }
  }
}
</script>
