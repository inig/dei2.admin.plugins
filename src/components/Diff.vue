<template>
  <div class="diff_container">
    <div class="diff_inner">
      <!-- <div class="diff_header">
        <div class="diff_header_item diff_header_left">
          <Input :value="sourceFile.name"
                 prefix="md-document"
                 class="diff_input"
                 readonly
                 placeholder="选择文件"
                 style="width: 250px" />
          <Upload action="/"
                  :before-upload="chooseSourceFile"
                  class="diff_upload"
                  :show-upload-list="false">
            <Button icon="ios-folder-open"
                    type="primary">选择文件</Button>
          </Upload>
          <Select v-model="sourceEncodeType"
                  style="width: 100px;">
            <Option v-for="(item, index) in allEncodeTypes"
                    :key="item.value"
                    :value="item.value">{{item.name}}</Option>
          </Select>
        </div>
        <div class="diff_header_item diff_header_right">
          <Input :value="sourceFile.name"
                 prefix="md-document"
                 class="diff_input"
                 readonly
                 placeholder="选择文件"
                 style="width: 250px" />
          <Upload action="/"
                  :before-upload="chooseTargetFile"
                  class="diff_upload"
                  :show-upload-list="false">
            <Button icon="ios-folder-open"
                    type="primary">选择文件</Button>
          </Upload>
          <Select v-model="targetEncodeType"
                  style="width: 100px;">
            <Option v-for="(item, index) in allEncodeTypes"
                    :key="item.value"
                    :value="item.value">{{item.name}}</Option>
          </Select>
        </div>
      </div> -->
      <div class="diff_header">
        <div class="diff_header_item diff_header_left">
          Old
        </div>
        <div class="diff_header_item diff_header_right">
          Current
        </div>
      </div>
      <div class="mergely_container">
        <div class="mergely-full-screen-8">
          <div class="mergely-resizer">
            <div id="mergely"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
/*@import url('/html/static/pkg/codemirror/lib/codemirror.css');
	@import url('/html/static/pkg/mergely/lib/mergely.css');*/
.diff_container {
  width: 100%;
  height: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}
.diff_inner {
  position: relative;
  /* width: 1000px; */
  width: 100%;
  height: 100%;
  padding: 0;
  box-sizing: border-box;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  /*align-items: center;*/
  justify-content: space-between;
  background-color: rgba(255, 255, 255, 0.9);
}
.diff_header {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.diff_header_item {
  width: 50%;
  height: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
}
.diff_header_left {
}
.diff_header_right {
}
.mergely_container {
  position: relative;
  width: 100%;
  height: 100%;
}
#mergely {
  width: 100%;
  height: 100%;
}
</style>
<script>
// import $ from 'jquery'
// import '../../../node_modules/mergely/lib/mergely.js'
export default {
  name: 'diff',
  props: {
    left: {
      type: String
    },
    right: {
      type: String
    }
  },
  data () {
    return {
      reader: null,
      sourceFile: {},
      targetFile: {},
      allEncodeTypes: [
        {
          name: 'UTF-8',
          value: 'UTF-8'
        },
        {
          name: 'GBK',
          value: 'GBK'
        },
        {
          name: 'GB2312',
          value: 'GB2312'
        },
        {
          name: 'GB18030',
          value: 'GB18030'
        },
        {
          name: 'ISO-8859-2',
          value: 'ISO-8859-2'
        }
      ],
      sourceEncodeType: 'UTF-8',
      targetEncodeType: 'UTF-8'
    }
  },
  computed: {
    // bodyStyles () {
    //   return this.$store.state.bodyStyles
    // },
    // diffContainerStyles () {
    //   return {
    //     height: (this.bodyStyles.height - 65) + 'px'
    //   }
    // }
    spanLeft () {
      return this.$store.state.spanLeft
    }
  },
  async created () {
    const that = this
    await this.loadStyle('/static/pkg/codemirror/lib/codemirror.css')
    await this.loadStyle('/static/pkg/mergely/lib/mergely.css')
    await this.loadScript('/static/pkg/jquery/dist/jquery.min.js')
    await this.loadScript('/static/pkg/codemirror/lib/codemirror.js')
    await this.loadScript('/static/pkg/codemirror/addon/search/searchcursor.js')
    await this.loadScript('/static/pkg/mergely/lib/mergely.js')
    this.$nextTick(() => {
      this.reader = new FileReader()
      setTimeout(() => {
        $(document).ready(function () {
          $('#mergely').mergely({
            lhs: function (setValue) {
              setValue(that.left || 'good good study, day day down')
            },
            rhs: function (setValue) {
              setValue(that.right || 'good good study, day day up')
            }
          })
        })
      }, 100)
    })
  },
  mounted () {
    window.onresize = (e) => {
      console.log('.........')
      // $('#mergely').mergely('resize')
    }
  },
  methods: {
    chooseSourceFile (f) {
      this.sourceFile = f
      this.reader.readAsText(f, this.sourceEncodeType || 'UTF-8')
      this.reader.onload = function (e) {
        $('#mergely').mergely('lhs', e.target.result)
      }
      return false
    },
    chooseTargetFile (f) {
      this.targetFile = f
      this.reader.readAsText(f, this.targetEncodeType || 'UTF-8')
      this.reader.onload = function (e) {
        $('#mergely').mergely('rhs', e.target.result)
      }
      return false
    }
  },
  watch: {
    spanLeft (val) {
      $('#mergely').mergely('resize')
    }
  }
}
</script>