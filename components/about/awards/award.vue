<template>
  <li class="award">
    <div class="line" ref="line" v-if="id == 0"></div>
    <div class="inner" ref="inner">
      <div class="award"><span v-text="award.award"></span></div>
      <div><span v-text="award.title"></span></div>
      <div class="year"><span v-text="award.year"></span></div>
    </div>
    <div class="line" ref="line"></div>
  </li>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'award',
  data() {
    return {}
  },
  computed: { ...mapState(['reducedMotion']) },

  props: ['award', 'id'],
  methods: {
    show(delay) {
      if (this.$refs.lineTop) {
        gsap.to(this.$refs.lineTop, {
          scaleX: 1,
          duration: this.reducedMotion ? 0 : 1,
          ease: 'power4.out',
          force3D: true
        })
      }
      gsap.to(this.$refs.line, {
        scaleX: 1,
        delay: 0.1 + delay * 0.3,
        duration: this.reducedMotion ? 0 : 1,
        ease: 'power4.out',
        force3D: true
      })
      gsap.to(this.$refs.inner, {
        translateY: '0%',
        delay: 0.3 + delay * 0.3,
        duration: this.reducedMotion ? 0 : 1,
        ease: 'power4.out',
        force3D: true
      })
    },
    reset() {
      if (this.$refs.lineTop) gsap.killTweensOf(this.$refs.lineTop)
      gsap.killTweensOf(this.$refs.line)
      gsap.killTweensOf(this.$refs.inner)
      if (this.$refs.lineTop) gsap.set(this.$refs.lineTop, { scaleX: 0 })
      gsap.set(this.$refs.line, { scaleX: 0 })
      gsap.set(this.$refs.inner, { translateY: '100%' })
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.reducedMotion) this.reset()
    })
  }
}
</script>
<style lang="scss">
li.award {
  width: 100%;
  overflow: hidden;
  .inner {
    display: flex;
    line-height: 3;
  }
  .line {
    background: currentColor;
    width: 100%;
    height: 1px;
    transform-origin: 0 0;
  }
  div {
    flex: 1;
    display: flex;
  }
  .award {
    flex: 2;
  }
  .year {
    justify-content: flex-end;
  }
  span {
    display: flex;
  }
  @include below(medium) {
    .inner {
      padding-top: vwM(10);
      padding-bottom: vwM(10);
      flex-wrap: wrap;
      line-height: 2;
    }
    .award {
      width: 100%;
      flex: auto;
      margin-bottom: -7px;
    }
  }
}
</style>
