<template>
  <div class="img-text">
    <div class="image" ref="image">
      <v-media :data="data.media" />
    </div>
    <div class="text" ref="text" :class="{ inverse: data.hasBackground }">
      <article>
        <strong v-text="data.title"></strong>
        <div v-html="data.text"></div>
      </article>
    </div>
  </div>
</template>
<script>
import vMedia from '~/components/fragments/media.vue'
import { mapState } from 'vuex'
export default {
  name: 'duo',
  data() {
    return {
      scrollTop: 0,
      isShown: true,
      isLoaded: false
    }
  },
  props: ['data'],
  components: { vMedia },
  computed: { ...mapState(['reducedMotion']) },
  methods: {
    tick(scrollTop) {
      this.scrollTop = scrollTop
      if (this.scrollTop > this.start) {
        if (!this.isShown) this.show()
      }
      if (this.scrollTop < this.start) {
        if (this.isShown) this.reset()
      }
      if (this.scrollTop > this.loadHeight) {
        if (!this.isLoaded) {
          this.isLoaded = true
          this.$children.forEach((element) => {
            element.load()
          })
        }
      }
    },
    resize(w, h) {
      const { top, height } = this.$el.getBoundingClientRect()
      this.start = this.scrollTop + top - h
      this.end = this.start + h + height
      this.loadHeight = this.start - h
    },
    show() {
      this.isShown = true
      gsap.killTweensOf(this.els)
      gsap.to(this.els, {
        scale: 1,
        opacity: 1,
        duration: this.reducedMotion ? 0 : 1,
        translateY: 0,
        stagger: 0.7,
        force3D: true,
        ease: 'power2.out',
        onStart: (el) => {
          this.els.forEach((element) => {
            element.style.willChange = 'transform, opacity'
          })
        },
        onComplete: () => {
          this.els.forEach((element) => {
            element.style.willChange = 'auto'
          })
        }
      })
    },
    reset() {
      this.isShown = false
      gsap.killTweensOf(this.els)
      gsap.set(this.$refs.image, { translateY: '30%', scale: 1.1, opacity: 0 })
      gsap.set(this.$refs.text, { translateY: '0%', scale: 1, opacity: 0 })
    }
  },
  mounted() {
    this.els = [this.$refs.image, this.$refs.text]
  }
}
</script>
<style lang="scss">
.img-text {
  display: flex;
  .image,
  .text {
    overflow: hidden;
    height: 100vh;
    width: 50%;
  }
  .text {
    padding: 0 5%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  strong {
    display: block;
    margin-bottom: 1em;
    font-weight: $light;
  }
  @include below(medium) {
    display: block;
    .image,
    .text {
      height: auto;
      width: 80%;
      margin-left: auto;
      margin-right: auto;
    }
    .text {
      margin-top: vwM(50);
    }
  }
}
</style>
