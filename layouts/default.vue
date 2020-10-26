<template>
  <main
    :class="[
      { 'no-touch': !isTouch },
      { 'is-touch': isTouch },
      { isScrolling },
      pageColor,
      $route.name
    ]"
  >
    <client-only>
      <v-scroller ref="scroller" v-if="!isTouch" />
    </client-only>
    <client-only>
      <v-scene ref="scene"></v-scene>
    </client-only>
    <client-only>
      <v-transition ref="transition"></v-transition>
    </client-only>
    <v-navigation ref="navigation"></v-navigation>
    <v-loader v-if="!isLoaderAnimationDone" />

    <div class="scroll" ref="scroll">
      <nuxt ref="page" :key="$route.params.slug || $route.name" />
    </div>
  </main>
</template>
<script>
import emitter from '~/assets/js/events/EventsEmitter'

import vNavigation from '~/components/common/navigation.vue'
import vLoader from '~/components/common/loader.vue'

import vTransition from '~/components/common/transition.vue'
import { mapState, mapGetters, mapActions } from 'vuex'
import ScrollHelper from '../assets/js/utils/ScrollHelper'
import ResizeHelper from '../assets/js/utils/ResizeHelper'

import WheelHelper from '~/assets/js/utils/WheelHelper'
import transform from 'dom-transform'
import MouseHelper from '../assets/js/utils/MouseHelper'
import vScene from '~/components/scene/scene.vue'
import vScroller from '~/components/common/scroller.vue'

export default {
  data() {
    return { scrollTop: 0, isScrolling: false }
  },
  components: {
    vLoader,
    vScroller,
    vTransition,
    vNavigation,
    vScene
  },
  computed: {
    ...mapState(['isLoaderAnimationDone', 'isDark', 'reducedMotion']),
    ...mapGetters(['isTouch']),

    pageColor() {
      return this.$route.name === 'about' || this.$route.name === 'index'
        ? this.isDark
          ? 'light'
          : 'dark'
        : this.isDark
        ? 'dark'
        : 'light'
    }
  },
  methods: {
    ...mapActions(['set']),
    tick() {
      if (!this.w) return
      WheelHelper.tick()
      ScrollHelper.tick()
      if (!this.isTouch && !this.reducedMotion) MouseHelper.tick()
      const realScrollTop = ScrollHelper.scrollTop
      const scrollTop = this.isTouch
        ? ScrollHelper.scrollTop
        : Math.round(ScrollHelper.ease)
      if (this.$refs.page && this.$refs.page.$children[0]) {
        this.$refs.page.$children[0].tick &&
          this.$refs.page.$children[0].tick(scrollTop)
      }
      if (this.$refs.transition && this.isTransitionShowned) {
        this.$refs.transition.tick()
      }
      if (!this.isTouch) {
        transform(this.$refs.scroll, {
          translate3d: [0, -scrollTop, 0]
        })
      }
      if (Math.abs(this.scrollTop - scrollTop) >= 1) {
        this.isScrolling = true
      } else {
        this.isScrolling = false
      }
      this.$refs.transition.tick()

      this.scrollTop = scrollTop
      if (this.$refs.scroller) this.$refs.scroller.tick(scrollTop)
      this.$refs.navigation.tick(scrollTop)
      this.$refs.scene.tick(scrollTop)
    },
    onResize() {
      this.w = ResizeHelper.width()
      this.h = ResizeHelper.height()
      const pageHeight = this.$refs.scroll.clientHeight
      if (this.$refs.page && this.$refs.page.$children[0])
        this.$refs.page.$children[0].resize &&
          this.$refs.page.$children[0].resize(this.w, this.h, pageHeight)
      if (!this.isTouch) {
        document.body.style.height = pageHeight + 'px'
      }
      this.$refs.transition.resize(this.w, this.h)
      this.$refs.navigation.resize(this.w, this.h, pageHeight)
      this.$refs.scene.resize(this.w, this.h, pageHeight)
      if (this.$refs.scroller)
        this.$refs.scroller.resize(this.w, this.h, pageHeight)
    },
    setRouterHook() {
      this.$router.beforeEach((to, from, next) => {
        let time = 500
        if (this.reducedMotion) {
          time = 100
        } else {
          if (to.name === 'work-slug') {
            time = 800
            this.$refs.page.$children[0].doPageTransition &&
              this.$refs.page.$children[0].doPageTransition()
            this.$refs.scene.doRouteTransition(to.params.slug)
          } else {
            this.$refs.transition.doTransition(to.name, from.name)
          }
        }
        setTimeout(() => {
          next()
        }, time)
      })
    },
    onMounted() {
      this.$refs.scene.changeRoute()
      ScrollHelper.goTo(0)
      if ('requestIdleCallback' in window) {
        requestIdleCallback(this.onMountedReady.bind(this), {
          timeout: 500
        })
      } else {
        setTimeout(() => {
          this.onMountedReady()
        }, 100)
      }
    },
    onMountedReady() {
      this.onResize()
      if ('requestIdleCallback' in window) {
        requestIdleCallback(
          () => {
            this.$refs.transition.hideTransition()
          },
          {
            timeout: 500
          }
        )
      } else {
        setTimeout(() => {
          this.$refs.transition.hideTransition()
        }, 100)
      }
      setTimeout(() => {
        this.onResize()
      }, 3000)
    }
  },
  mounted() {
    this.set({
      property: 'isDark',
      value: Math.round(Math.random()) === 1
    })
    gsap.ticker.add(this.tick.bind(this))
    this.setRouterHook()
    emitter.on('GLOBAL:RESIZE', this.onResize.bind(this))
    emitter.on('PAGE:MOUNTED', this.onMounted.bind(this))
    if (!this.isTouch) {
      document.querySelector('html').classList.add('no-touch')
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.className += ' reduced-motion'
      this.set({ property: 'reducedMotion', value: true })
    }
  }
}
</script>

<style lang="scss">
.isScrolling * {
  user-select: none;
}

.no-touch.isScrolling .scroll {
  will-change: transform;
}
* {
  text-rendering: optimizeSpeed;
}
main {
  position: relative;
  overflow: hidden;
  width: 100vw;
  min-height: 100vh;

  &.no-touch {
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
  }
  .scroll {
    position: relative;
  }
}
</style>
