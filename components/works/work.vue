<template>
  <article
    class="work-item"
    :class="data.slug"
    @click="onClick"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <nuxt-link :to="{ name: 'work-slug', params: { slug: data.slug } }">
      <v-logo :fill="data.color.hex" ref="svg" />
      <h3 v-text="data.title"></h3>
    </nuxt-link>
  </article>
</template>
<script>
import transform from 'dom-transform'
import emitter from '~/assets/js/events/EventsEmitter'
import vLogo from '~/assets/svgs/logo.svg?inline'
import { mapState } from 'vuex'
export default {
  name: 'work-item',
  props: ['data'],
  components: { vLogo },
  computed: { ...mapState(['reducedMotion']) },
  computed: {},
  methods: {
    onClick() {
      this.$emit('clicked')
      this.$el.style.zIndex = 5
      gsap.to(this.$refs.svg, {
        scale: 10,
        duration: this.reducedMotion ? 0 : 1,
        ease: 'power4.inOut'
      })
      if (window.innerWidth >= 1000) window.scrollTo(0, 0)
    },
    onMouseEnter() {
      emitter.emit('WORK:ENTER', { slug: this.data.slug })
    },
    onMouseLeave() {
      emitter.emit('WORK:LEAVE', { slug: this.data.slug })
    }
    /*tick(scrollTop) {
      const coef =
        (scrollTop - (this.top + this.h * 0.5 - this.height * 0.5)) /
        (this.top + this.height + this.h)
      transform(this.$el, { translate3d: [coef * 2 * 100 + '%', 0, 0] })
    },
    resize(w, h) {
      this.w = w
      this.h = h
      const { top, height } = this.$el.getBoundingClientRect()
      this.top = top
      this.height = height
    }*/
  },
  mounted() {}
}
</script>

<style lang="scss">
.work-item {
  a {
    display: block;
  }
  + .work-item {
    margin-top: vw(200);
  }
  h3 {
    display: block;
    font-family: $orpheus;
    font-size: vw(40);
    font-weight: normal;
    line-height: 1.18;
    padding: vw(10) vw(44) 0;
  }
  @include below(medium) {
    margin-top: vwM(100) !important;
    h3 {
      font-size: vwM(35);
      padding: vwM(10) vwM(30) 0;
    }
    &.la-grande-epicerie h3 {
      padding-right: vwM(0);
    }
  }
}
</style>
