<template>
  <div class="container">
    <div class="search_box">
      <Input suffix="ios-search"
             class="search_input"
             placeholder="搜索组件名或作者名"
             :clearable="true"
             @on-change="searchComponent"
             v-model="searchValue" />
    </div>
  </div>
</template>
<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}
.search_box {
  position: relative;
  width: 300px;
  height: 100%;
  z-index: 999;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.search_input {
  width: 100%;
}
.result_box {
  position: absolute;
  left: 0;
  top: 100%;
  z-index: 999;
  width: 400px;
  height: 300px;
  border: 1px solid #dddddd;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  background-color: #ffffff;
}
.result_box_mask {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 998;
  width: 100%;
  height: 100%;
}
</style>
<script>
import * as types from '../../../store/mutation-types'
export default {
  name: 'HeaderSearch',
  data () {
    return {
      searchValue: ''
    }
  },
  methods: {
    searchComponent (e) {
      this.$store.commit(types.COMPONENT_SEARCH, {
        value: this.searchValue.trim()
      })
    }
  }
}
</script>
