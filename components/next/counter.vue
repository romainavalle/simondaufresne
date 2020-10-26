<template>
  <div class="counter">
    {{ current }} / 3
    <svg viewBox="0 0 72 52">
      <ellipse
        cx="36"
        cy="26"
        rx="34"
        ry="24"
        stroke-width="1.5"
        ref="ellipse"
      />
    </svg>
  </div>
</template>
<script>
import WheelHelper from '~/assets/js/utils/WheelHelper'
import { mapState } from 'vuex'
export default {
  name: 'counter',
  data() {
    return { current: 1 }
  },
  computed: { ...mapState(['reducedMotion']) },
  methods: {
    resize() {
      this.length = this.$refs.ellipse.getTotalLength()
    },
    resetCounter(current) {
      gsap.killTweensOf(this.$refs.ellipse)
      gsap.killTweensOf(this.tween)
    },
    setCurrent(current) {
      this.current = current
    },
    startCounter() {
      this.tween = gsap.fromTo(
        this.$refs.ellipse,
        {
          strokeDasharray: this.length,
          strokeDashoffset: this.length,
          opacity: 1
        },
        {
          strokeDashoffset: 0,
          ease: 'Linear.inOut',
          duration: 5,
          onUpdate: (e) => {
            this.tween.timeScale(1 + WheelHelper.deltaEase / 15)
          },
          onComplete: () => {
            gsap.to(this.$refs.ellipse, {
              opacity: 0,
              duration: 1
            })
            this.$emit('onTimerEnd')
          }
        }
      )
    },
    hide() {
      gsap.killTweensOf(this.tween)
      gsap.killTweensOf(this.$refs.ellipse)
    }
  },
  mounted() {
    this.length = this.$refs.ellipse.getTotalLength()

    gsap.set(this.$refs.ellipse, { opacity: 0 })
  }
}
</script>
<style lang="scss">
.counter {
  position: absolute;
  bottom: vw(30);
  right: vw(40);
  text-align: right;
  font-size: vw(14);
  line-height: 1;
  font-weight: normal;
  display: block;
  padding: vw(20) vw(16);
  svg {
    display: block;
    position: absolute;
    height: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(-1, -1);
    fill: none;
    stroke: currentColor;
  }

  @include below(medium) {
    position: fixed;
    font-size: vwM(14);
    padding: vwM(20) vwM(16);
    bottom: vwM(35);
    right: vwM(20);
  }
}
</style>
