<template>
  <li class="tag">
    <span class="inner" ref="inner" v-text="tag.label"></span>
  </li>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'tag',
  data() {
    return {}
  },
  props: ['tag'],
  computed: { ...mapState(['reducedMotion']) },
  methods: {
    show(delay) {
      gsap.to(this.$refs.inner, {
        translateY: '0%',
        delay: delay * 0.3,
        duration: this.reducedMotion ? 0 : 1,
        ease: 'power4.out',
        force3D: true
      })
    },
    reset() {
      gsap.killTweensOf(this.$refs.inner)
      gsap.set(this.$refs.inner, { translateY: '100%' })
    }
  },
  mounted() {
    this.reset()
  }
}
</script>
<style lang="scss">
li.tag {
  text-transform: uppercase;
  display: block;
  opacity: 0.4;
  overflow: hidden;
  span {
    display: block;
  }
}
</style>
