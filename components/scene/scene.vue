<template>
  <div class="scene" :class="{ opacity: this.$route.name === 'about' }"></div>
</template>
<script>
import emitter from '~/assets/js/events/EventsEmitter.js'
import Main from './comps/Main'
import { mapState, mapGetters } from 'vuex'
import transform from 'dom-transform'
export default {
  name: 'scene',
  data() {
    return { h: 0, scrollTop: 0 }
  },
  computed: {
    ...mapState(['allWorks', 'reducedMotion']),
    ...mapGetters(['currentIndex']),
    hasNextSection() {
      return this.$route.name !== 'about' && this.$route.name !== 'work'
    }
  },
  methods: {
    tick(scrollTop) {
      if (this.$route.name === 'about') return
      if (this.$route.name === '404') return
      if (this.$route.name === 'custom404') return
      this.scene.tick(scrollTop)
      if (!this.hasNextSection) return
      if (scrollTop > this.ph - this.h * 1.2) this.scene.showBottom()
    },
    resize(w, h, pageHeight) {
      if (w && h) {
        this.w = w
        this.h = h
        this.ph = pageHeight
      }
      this.scene.resize(this.w, this.$el.clientHeight, pageHeight)
      // if (w < 1000) {
      //   this.$el.style.width = w + 'px'
      //   this.$el.style.height = h + 'px'
      // }
    },
    getIdFromSlug(slug) {
      return this.allWorks.indexOf(this.allWorks.find((el) => el.slug === slug))
    },
    doRouteTransition(slug) {
      clearTimeout(this.enterTimer)
      this.isDoingTransition = true
      this.scene.doRouteTransition(this.getIdFromSlug(slug))
    },
    changeRoute() {
      this.scene.changeRoute(this.currentIndex)
    },
    onWorkEnter(obj) {
      this.isEntering = obj.slug
      if (!this.isDoingAnim) this.doEnterAnim()
    },
    doEnterAnim() {
      this.tempEntering = this.isEntering
      this.isDoingAnim = true
      this.scene.onWorkEnter({ id: this.getIdFromSlug(this.isEntering) })
      this.enterTimer = setTimeout(() => {
        this.isDoingAnim = false
        if (this.isEntering !== '' && this.tempEntering !== this.isEntering) {
          if (!this.isDoingAnim) this.doEnterAnim()
        }
      }, 200)
    },
    onWorkLeave(obj) {
      if (this.isDoingTransition) return

      this.isEntering = ''
      this.scene.onWorkLeave({ id: this.getIdFromSlug(obj.slug) })
    }
  },
  watch: {
    '$route.name'(val) {
      this.scene.setRouteName(val)
      setTimeout(() => {
        this.isDoingTransition = false
      }, 100)
    }
  },
  beforeDestroy() {},
  mounted() {
    this.isEntering = ''
    this.scene = new Main(this.$el, this.allWorks, this.reducedMotion)
    this.scene.changeRoute(this.currentIndex)
    this.scene.setRouteName(this.$route.name)
    emitter.addListener('WORK:ENTER', this.onWorkEnter.bind(this))
    emitter.addListener('WORK:LEAVE', this.onWorkLeave.bind(this))
  }
}
</script>

<style lang="scss">
.scene {
  height: 100vh;
  min-height: 100vh;
  min-height: -webkit-fill-available;
  max-height: 100vh;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  pointer-events: none;
  z-index: 2;
  transition: opacity 0.5s;

  &.opacity {
    display: none;
  }
  @include below(small) {
    .work & {
      opacity: 0;
    }
  }
}
</style>
