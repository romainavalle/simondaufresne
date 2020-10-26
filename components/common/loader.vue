<template>
  <div class="loader">
    <v-logo />
    <v-logo class="logo" />
    <v-logo class="logo" />
    <v-logo class="logo" />
    <v-logo class="logo" />
  </div>
</template>

<script>
import vLogo from '~/assets/svgs/logo.svg?inline'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'loader',
  data() {
    return {}
  },
  computed: { ...mapState(['reducedMotion']) },
  components: { vLogo },
  methods: {
    ...mapActions(['set']),
    hide() {
      this.logos.forEach((el, i) => {
        gsap
          .fromTo(
            el,
            { scaleX: 0, scaleY: 0 },
            {
              scaleX: 1,
              scaleY: 1,
              duration: this.reducedMotion ? 0 : 0.8,
              delay: 0.2 * i,
              ease: 'power4.in'
            }
          )
          .then(() => {
            this.svgs[i].style.display = 'none'
          })
      })
      gsap
        .to(this.$el, {
          autoAlpha: 0,
          duration: this.reducedMotion ? 0 : 0.1,
          ease: 'power3.out',
          delay: 1.4
        })
        .then(() => {
          this.set({ property: 'isLoaderAnimationDone', value: true })
        })
    }
  },
  beforeDestroy() {},
  mounted() {
    this.svgs = [].slice.call(this.$el.querySelectorAll('svg'))
    this.logos = [].slice.call(this.$el.querySelectorAll('.logo'))
    this.$nextTick(() => {
      this.hide()
    })
  }
}
</script>

<style lang="scss">
.loader {
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  transform-origin: 50% 0%;
  z-index: 10;

  svg {
    position: absolute;
    transform: none;
    fill: currentColor;
    top: vw(40);
    left: vw(40);
    width: vw(45);
    height: vw(60);
    display: block;
    @include below(medium) {
      top: vwM(30);
      left: vwM(20);
      width: vwM(45);
      height: vwM(60);
    }
  }
}
</style>
