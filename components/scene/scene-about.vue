<template>
  <div class="scene-about"></div>
</template>
<script>
import Main from './comps/MainAbout'
import { mapState } from 'vuex'
import transform from 'dom-transform'
export default {
  name: 'scene',
  data() {
    return { h: 0, scrollTop: 0 }
  },
  props: ['img'],
  computed: { ...mapState(['reducedMotion']) },
  methods: {
    tick(scrollTop) {
      const top =
        this.$route.name === '404' || this.$route.name === 'custom404'
          ? 0
          : -this.h * 0.09 + scrollTop / 8
      this.scene.tick(top)
      if (this.w >= 1000) {
        transform(this.$el, { translate3d: [0, scrollTop, 0] })
      }
    },
    resize(w, h) {
      if (w && h) {
        this.w = w
        this.h = h
      }
      this.scene.resize(this.w, this.w < 1000 ? this.$el.clientHeight : this.h)
    },
    hideCard() {
      this.scene.hideCard()
    }
  },
  beforeDestroy() {},
  mounted() {
    this.scene = new Main(this.$el, [this.img.url], this.reducedMotion)
  }
}
</script>

<style lang="scss">
.scene-about {
  height: 100vh;
  min-height: 100vh;
  min-height: -webkit-fill-available;
  max-height: 100vh;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  pointer-events: none;
  z-index: 1;
}
</style>
