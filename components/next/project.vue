<template>
  <li class="project" :class="{ isReady }">
    <nuxt-link
      :to="{ name: 'work-slug', params: { slug: project.slug } }"
      class="project"
    >
      <div class="title-container">
        <v-title
          ref="title"
          class="title"
          :text="project.title"
          @out="onAnimationOutDone"
        />
      </div>
    </nuxt-link>
    <v-logo :fill="project.color.hex" ref="svg" />
  </li>
</template>
<script>
import vLogo from '~/assets/svgs/logo.svg?inline'
import vTitle from '~/components/common/title.vue'
import { mapState } from 'vuex'
export default {
  name: 'projects',
  data() {
    return { isReady: false }
  },
  props: ['project'],
  computed: { ...mapState(['reducedMotion']) },
  components: { vTitle, vLogo },
  methods: {
    resize(w, h) {
      this.h = h
      this.$refs.title.resize(w, h)
    },
    tick(scrollTop) {
      this.$refs.title.animateText()
    },
    doPageTransition() {
      gsap.to(this.$refs.svg, {
        scale: 8,
        duration: this.reducedMotion ? 0 : 1.5,
        ease: 'power4.inOut'
      })
    },
    show(duration = 2) {
      this.$refs.title.show()
      gsap.set(this.$el, { autoAlpha: 1 })
      gsap.to(this.$refs.svg, { opacity: 1, ease: 'power4.out', duration })
      setTimeout(() => {
        this.isReady = true
      }, 1000)
    },
    hide() {
      this.isReady = false
      this.$el.style.zIndex = 0
      this.$refs.title.hide()
      gsap.to(this.$refs.svg, {
        opacity: 0,
        ease: 'power4.out',
        duration: this.reducedMotion ? 0 : 2
      })
    },
    onAnimationOutDone() {
      gsap.set(this.$el, { autoAlpha: 0 })
    }
  },
  mounted() {
    gsap.set(this.$el, { autoAlpha: 0 })
    gsap.set(this.$refs.svg, { opacity: 0 })
  }
}
</script>
<style lang="scss">
.project {
  position: absolute;
  display: block;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  min-height: -webkit-fill-available;
  &.isReady a {
    pointer-events: auto;
  }
  svg {
    pointer-events: none;
    position: absolute;
    display: block;
    width: 42.525vmin;
    height: 57.1vmin;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  a {
    pointer-events: none;

    position: absolute;
    display: block;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .title-container {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  @include below(medium) {
    svg {
      width: 65vmin;
      height: 87.27vmin;
    }
  }
}
</style>
