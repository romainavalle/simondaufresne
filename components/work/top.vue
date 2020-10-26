<template>
  <header class="top " ref="top">
    <div class="bg" :style="{ backgroundColor: work.color.hex }"></div>
    <v-logo ref="svg" />
    <div class="title-container">
      <h1 v-text="work.title"></h1>
      <div ref="titleCont">
        <v-title ref="title" :text="work.title" />
      </div>
    </div>
  </header>
</template>
<script>
import vTitle from '~/components/common/title.vue'
import vLogo from '~/assets/svgs/logo.svg?inline'
import transform from 'dom-transform'
import { mapState } from 'vuex'
export default {
  data() {
    return { rotation: -10 }
  },
  props: ['work'],
  computed: { ...mapState(['reducedMotion']) },
  components: { vTitle, vLogo },
  methods: {
    resize(w, h) {
      this.h = h
      this.$refs.title.resize(w, h)
    },
    tick(scrollTop) {
      this.$refs.title.tick(scrollTop)
    }
  },
  mounted() {
    this.$nextTick(() => {
      gsap.fromTo(
        this.$refs.titleCont,
        { opacity: 0 },
        {
          opacity: 1,
          force3D: true,
          duration: this.reducedMotion ? 0 : 1.5,
          ease: 'power4.inOut'
        }
      )
      gsap
        .fromTo(
          this.$refs.svg,
          { scale: 0 },
          {
            scale: 8,
            force3D: true,
            duration: this.reducedMotion ? 0 : 1.5,
            ease: 'power4.inOut'
          }
        )
        .then(() => {
          this.$refs.svg.style.opacity = 0
          this.$el.querySelector('.bg').style.opacity = 0
        })
    })
  }
}
</script>

<style lang="scss">
section.work {
  .top {
    position: relative;

    color: currentColor;
    h1 {
      display: none;
    }
    svg {
      position: absolute;
      display: block;
      width: vw(356);
      height: vw(473);
      position: absolute;

      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .light & svg {
      fill: $white;
    }
    .dark & svg {
      fill: $black;
    }
    .bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    .title-container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
