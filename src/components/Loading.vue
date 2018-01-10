<template>
    <transition
            name="loader-transition"
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
    >
        <div :ref="dataRef" class="loader loading_container" v-if="showLoading">
            <div class="loader-inner" :class="type">
                <div v-for="(item, index) in allTypes[type]" :key="index"></div>
            </div>
        </div>
    </transition>
</template>
<style scoped>
    @import "../assets/css/loading.css";
    .loading_container {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
<script>
  import * as types from '../store/mutation-types'
  export default {
    name: 'Loading',
    props: ['dataRef'],
    data () {
      return {
        allTypes: {
          'ball-pulse': 3,
          'ball-grid-pulse': 9,
          'ball-clip-rotate': 1,
          'ball-clip-rotate-pulse': 2,
          'square-spin': 1,
          'ball-clip-rotate-multiple': 2,
          'ball-pulse-rise': 5,
          'ball-rotate': 1,
          'cube-transition': 2,
          'ball-zig-zag': 2,
          'ball-zig-zag-deflect': 2,
          'ball-triangle-path': 3,
          'ball-scale': 1,
          'line-scale': 5,
          'line-scale-party': 4,
          'ball-scale-multiple': 3,
          'ball-pulse-sync': 3,
          'ball-beat': 3,
          'line-scale-pulse-out': 5,
          'line-scale-pulse-out-rapid': 5,
          'ball-scale-ripple': 1,
          'ball-scale-ripple-multiple': 3,
          'ball-spin-fade-loader': 8,
          'line-spin-fade-loader': 8,
          'triangle-skew-spin': 1,
          'pacman': 5,
          'ball-grid-beat': 9,
          'semi-circle-spin': 1
        },
        type: this.$store.state.loadingType || 'ball-scale-ripple-multiple',
        showLoading: false
      }
    },
    created () {
      this.$nextTick(() => {
        this.setLoader()
      })
    },
    methods: {
      setLoader () {
        this.$store.commit(types.SET_LOADER, {
          name: this.dataRef,
          value: {
            vm: this
          }
        })
      },
      delLoader () {
        this.$store.commit(types.DEL_LOADER, {
          name: this.dataRef
        })
      },
      show () {
        this.showLoading = true
      },
      hide () {
        this.showLoading = false
      }
    },
    components: {}
  }
</script>
