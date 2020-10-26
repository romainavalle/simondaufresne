<template>
  <div class="duo" :class="data.addMargin ? 'c c--1000' : ''">
    <div class="imgLeft" ref="imgLeft">
      <div class="inner">
        <v-media :data="data.mediaRight" />
      </div>
    </div>
    <div class="imgRight" ref="imgRight">
      <div class="inner">
        <v-media :data="data.mediaLeft" />
      </div>
    </div>
  </div>
</template>
<script>
import vMedia from '~/components/fragments/media.vue'
import { mapState } from 'vuex'
export default {
  name: 'duo',
  data() {
    return {
      scrollTop: 0,
      isShown: true
    }
  },
  props: ['data'],
  computed: { ...mapState(['reducedMotion']) },
  components: { vMedia },
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
      gsap.to(this.els, {
        scale: 1,
        opacity: 1,
        duration: this.reducedMotion ? 0 : 1,
        translateY: 0,
        force3D: true,
        stagger: 0.1,
        ease: 'power2.out',
        onStart: (el) => {
          this.els.forEach((element) => {
            element.style.willChange = 'transform, opacity'
          })
        },
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
    this.els = [
      this.$refs.imgLeft.querySelector('.inner'),
      this.$refs.imgRight.querySelector('.inner')
    ]
  }
}
</script>
<style lang="scss">
.duo {
  display: flex;
  .imgLeft,
  .imgRight {
    overflow: hidden;
    height: 100vh;
    width: 50%;
  }
  &.c {
    .imgLeft,
    .imgRight {
      overflow: hidden;
      width: 100%;
      height: auto;
    }
    .imgRight {
      margin-left: 16%;
    }
  }
  > div {
    flex: 1;
    & + div {
      margin-left: 0;
    }
  }
  @include below(medium) {
    .imgLeft,
    .imgRight {
      height: auto;
    }
  }
}
</style>
