<template>
  <li class="client" v-text="client.name"></li>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'client',
  data() {
    return {}
  },
  props: ['client'],
  computed: { ...mapState(['reducedMotion']) },

  methods: {
    show(delay) {
      gsap.to(this.$el, {
        opacity: 1,
        scale: 1,
        delay,
        ease: 'power2.inout',
        duration: this.reducedMotion ? 0 : 4,
        force3D: true
      })
    },
    reset() {
      gsap.killTweensOf(this.$el)
      gsap.set(this.$el, { opacity: 0, scale: 1.1 })
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.reducedMotion) this.reset()
    })
  }
}
</script>
<style lang="scss">
li.client {
  display: block;
  font-family: $orpheus;
  font-size: vw(30);
  font-weight: normal;
  line-height: 1.7;
  margin: 0 vw(20);
  @include below(medium) {
    font-size: vwM(25);
    margin: 0 vwM(20);
  }
}
</style>
