<template>
  <footer class="c c--1000">
    <div class="line"></div>
    <div class="inner">
      <div class="left">
        <span>Paris {{ date }}</span>
      </div>
      <div class="center">
        <span
          ><a href="https://www.romainavalle.dev" target="_blank" rel="noopener"
            >Dev by Romain Avalle</a
          ></span
        >
      </div>
      <div class="right">
        <span>All rights reserved {{ date }}</span>
      </div>
    </div>
    <div class="line"></div>
  </footer>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'vFooter',
  data() {
    return { isShown: false }
  },
  computed: {
    ...mapState(['reducedMotion']),
    date() {
      return new Date().getFullYear()
    }
  },

  methods: {
    tick(scrollTop) {
      if (scrollTop > this.top - this.h * 0.95) {
        if (!this.isShown) {
          this.isShown = true
          this.show()
        }
      }
      if (scrollTop < this.top - this.h) {
        if (this.isShown) {
          this.isShown = false
          this.reset()
        }
      }
    },
    resize(w, h) {
      this.h = h
      this.top = this.$el.getBoundingClientRect().top
    },
    show() {
      gsap.to(this.lineStagger, {
        scaleX: 1,
        duration: this.reducedMotion ? 0 : 1,
        ease: 'power4.out',
        stagger: 0.7,
        force3D: true
      })
      gsap.to(this.divStagger, {
        translateY: '0%',
        opacity: 1,
        duration: this.reducedMotion ? 0 : 1,
        ease: 'power4.out',
        stagger: 0.2,
        delay: 0.3,
        force3D: true
      })
    },
    reset() {
      gsap.killTweensOf(this.lineStagger)
      gsap.killTweensOf(this.divStagger)
      gsap.set(this.lineStagger, {
        scaleX: 0
      })
      gsap.set(this.divStagger, {
        translateY: '100%',
        opacity: 0
      })
    }
  },
  mounted() {
    this.divStagger = [].slice.call(this.$el.querySelectorAll('.inner div'))
    this.lineStagger = [].slice.call(this.$el.querySelectorAll('.line'))
    this.reset()
  }
}
</script>
<style lang="scss">
footer {
  padding-top: $space100;
  padding-bottom: vw(48);
  overflow: hidden;
  .line {
    background: currentColor;
    width: 100%;
    height: 1px;
    transform-origin: 0 0;
  }
  .inner {
    margin-top: 1px;
    display: flex;
    line-height: 3;
    font-family: $orpheus;
    font-weight: normal;

    > * {
      flex: 1;
      display: flex;
    }
  }

  .center {
    justify-content: center;
  }
  .right {
    justify-content: flex-end;
  }
  @include below(medium) {
    padding-top: $space100M;
    padding-bottom: vwM(35);
    width: vwM(250) !important;
    .left,
    .right {
      display: none;
    }
  }
}
</style>
