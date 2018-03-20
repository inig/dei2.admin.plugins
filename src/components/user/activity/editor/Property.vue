<template>
  <div class="property_container">
    <component :is="activeComponent.type && activeComponent.type.replace('zpm-', 'property-')"></component>
  </div>
</template>
<style scoped>
  .property_container {
    width: 100%;
    height: 100%;
  }
</style>
<script>
  export default {
    name: 'Property',
    data () {
      return {
        eventHub: this.$store.state.eventHub,
        events: this.$store.state.events,
        activeComponent: {}
      }
    },
    created () {
      this.$nextTick(() => {
        this.eventHub.$on(this.events.activeComponentChanged, this.activeComponentChanged)
      })
    },
    methods: {
      activeComponentChanged (data) {
        this.activeComponent = data
      }
    },
    components: {
      PropertyPage: () => import('../property/Page.vue'),
      PropertyButton: () => import('../property/Button.vue')
    }
  }
</script>
