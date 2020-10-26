<template>
  <div class="title">
    <client-only>
      <div ref="content">
        <div class="container" ref="inner" v-html="html"></div>
      </div>
    </client-only>
  </div>
</template>
<script>
import WheelHelper from '~/assets/js/utils/WheelHelper'
import transform from 'dom-transform'
import { mapState } from 'vuex'
export default {
  name: 'vTitle',
  data() {
    return {
      id: 0,
      scrollTop: 0
    }
  },
  props: {
    tag: {
      type: String,
      default: 'h2'
    },
    direction: {
      type: String,
      default: 'regular'
    },
    text: {
      type: String,
      default: ''
    },
    isProject: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(['reducedMotion']),
    words() {
      return Math.ceil((1 / this.text.length) * 18)
    },
    html() {
      let html = ''
      for (let index = 0; index < this.words; index++) {
        html += `<span class="word">&nbsp;&nbsp;<span>${this.text}</span>&nbsp;&nbsp;</span>`
      }
      html += `<span class="word">&nbsp;&nbsp;<span>${this.text}</span>&nbsp;&nbsp;</span>`
      return html
    }
  },
  methods: {
    tick(scrollTop) {
      this.scrollTop = scrollTop
      if (!this.doTick) return
      if (scrollTop > this.start && scrollTop < this.end) {
        this.animateText()
      } else {
        if (this.$refs.content.style.willChange === 'transform') {
          this.$refs.content.style.willChange = 'auto'
        }
      }
    },
    animateText() {
      if (this.reducedMotion) return
      if (this.$refs.content.style.willChange !== 'transform') {
        this.$refs.content.style.willChange = 'transform'
      }
      const skew = Math.min(Math.abs(WheelHelper.deltaEase) / 5, 15)

      if (this.direction === 'regular') {
        transform(this.$refs.content, {
          translate3d: [-this.id, 0, 0],
          skewX: skew
        })
      } else {
        transform(this.$refs.content, {
          translate3d: [-this.width + this.id, 0, 0],
          skewX: -skew
        })
      }
      if (this.id >= this.width) this.id = this.id - this.width
      this.id += 2 + Math.abs(WheelHelper.deltaEase) / 2
    },
    resize(w, h) {
      if (w && h) {
        this.w = w
        this.h = h
      }
      if (this.reducedMotion) return
      const { top, height, width } = this.$refs.content
        .querySelector('.word')
        .getBoundingClientRect()
      this.start = top + this.scrollTop - this.h
      this.end = this.start + this.h + height
      this.width = Math.round(width)
    },
    resetText() {
      this.$refs.inner.innerHTML = this.html
    },
    show() {
      this.id = 0
      this.doTick = true
      gsap.fromTo(
        this.$refs.inner,
        { y: '110%' },
        {
          opacity: 1,
          y: '0%',
          duration: this.reducedMotion ? 0 : 1.5,
          force3D: true,
          ease: 'power4.out'
        }
      )
    },
    hide() {
      gsap
        .to(this.$refs.inner, {
          y: '-110%',
          force3D: true,
          duration: this.reducedMotion ? 0 : 1.5,
          ease: 'power4.out'
        })
        .then(() => {
          this.$emit('out')
          this.doTick = false
          this.resetText()
        })
    }
  },
  beforeDestroy() {},
  mounted() {
    this.doTick = this.isProject ? false : true
    this.id = Math.round(Math.random() * 100)
    setTimeout(() => {
      this.resize()
    }, 500)
  }
}
</script>
<style lang="scss">
.title {
  width: 100vw;
  overflow: hidden;
  font-family: $orpheus;
  font-size: vw(150);
  font-weight: $regular;
  line-height: 1;
  letter-spacing: vw(-2.55);
  .el {
    display: none;
  }
  > div,
  .word {
    display: flex;
  }
  * {
    flex-shrink: 0;
  }
  span {
    display: block;
  }

  .container {
    display: flex;
    .reduced-motion & {
      margin-left: -25%;
    }
  }
  @include below(medium) {
    font-size: vwM(100);
  }
}
</style>
