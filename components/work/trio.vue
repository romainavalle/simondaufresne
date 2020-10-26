<template>
  <div class="trio c c--1000">
    <div ref="img1">
      <v-media :data="data.media1" />
    </div>
    <div ref="img2">
      <v-media :data="data.media2" />
    </div>
    <div ref="img3">
      <v-media :data="data.media3" />
    </div>
  </div>
</template>
<script>
import vMedia from '~/components/fragments/media.vue'
import { mapState } from 'vuex'
export default {
  name: 'trio',
  data() {
    return {
      scrollTop: 0,
      isShown: true,
      isLoaded: false
    }
  },
  props: ['data'],
  components: { vMedia },
  computed: { ...mapState(['reducedMotion']) },
  methods: {
    tick(scrollTop) {
      this.scrollTop = scrollTop
      if (this.scrollTop > this.start) {
        if (!this.isShown) this.show()
      }
      if (this.scrollTop < this.start) {
        if (this.isShown) this.reset()
      }
      if (this.scrollTop > this.loadHeight) {
        if (!this.isLoaded) {
          this.isLoaded = true
          this.$children.forEach((element) => {
            element.load()
          })
        }
      }
    },
    resize(w, h) {
      const { top, height } = this.$el.getBoundingClientRect()
      this.start = this.scrollTop + top - h
      this.end = this.start + h + height
      this.loadHeight = this.start - h
    },
    show() {
      this.isShown = true
      gsap.killTweensOf(this.els)
      gsap.to(this.els[0], {
        scale: 1,
        opacity: 1,
        duration: this.reducedMotion ? 0 : 1,
        translateY: 0,
        force3D: true,
        ease: 'power2.out',
        onStart: () => {
          this.els.forEach((element) => {
            element.style.willChange = 'transform, opacity'
          })
        }
      })
      gsap.to([this.els[1], this.els[2]], {
        scale: 1,
        opacity: 1,
        duration: this.reducedMotion ? 0 : 1,
        delay: 0.5,
        translateY: 0,
        force3D: true,
        ease: 'power2.out',
        onComplete: () => {
          this.els.forEach((element) => {
            element.style.willChange = 'auto'
          })
        }
      })
    },
    reset() {
      this.isShown = false
      gsap.killTweensOf(this.els)
      gsap.set(this.els, { translateY: '30%', scale: 1.1, opacity: 0 })
    }
  },
  mounted() {
    this.els = [this.$refs.img2, this.$refs.img1, this.$refs.img3]
  }
}
</script>
<style lang="scss">
.trio {
  display: flex;
  > div {
    flex: 1;
    & + div {
      margin-left: vw(70);
    }
  }
}
</style>
