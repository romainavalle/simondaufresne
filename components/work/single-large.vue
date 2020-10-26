<template>
  <div class="single-large">
    <div ref="img">
      <v-media :data="data.media" />
    </div>
  </div>
</template>
<script>
import transform from 'dom-transform'
import vMedia from '~/components/fragments/media.vue'
import { mapState } from 'vuex'
export default {
  name: 'single-large',
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

      if (!this.data.isParallax) return
      if (this.scrollTop > this.start && this.scrollTop < this.end) {
        const coef =
          (this.scrollTop - this.start) / (this.end - this.start) - 0.5
        transform(this.$refs.img, {
          translate3d: [
            0,
            this.w > this.h ? coef * this.h * 0.5 : coef * this.h * 0.1,
            0
          ]
        })
      }
    },
    resize(w, h) {
      this.h = h
      const { top, height } = this.$el.getBoundingClientRect()
      this.start = this.scrollTop + top - h
      this.end = this.start + h + height
      this.loadHeight = this.start - h
    },
    show() {
      this.isShown = true
      gsap.killTweensOf(this.$el)
      gsap.to(this.$el, {
        scale: 1,
        opacity: 1,
        duration: this.reducedMotion ? 0 : 1,
        translateY: 0,
        force3D: true,
        ease: 'power2.out',
        onStart: () => {
          this.$el.style.willChange = 'transform, opacity'
        },
        onComplete: () => {
          this.$el.style.willChange = 'auto'
        }
      })
    },
    reset() {
      this.isShown = false
      gsap.killTweensOf(this.$el)
      gsap.set(this.$el, { translateY: '10%', scale: 1.2, opacity: 0 })
    }
  },
  mounted() {}
}
</script>
<style lang="scss">
.single-large {
  overflow: hidden;
  @include below(medium) {
    img {
      object-fit: cover;
      height: 50vh;
    }
  }
}
</style>
