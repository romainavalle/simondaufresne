<template>
  <article>
    <div class=" c c--1000">
      <div class="tags ">
        <ul>
          <v-tag
            v-for="(tag, i) in data.tags"
            :key="`tag-${i}`"
            :tag="tag"
            ref="tags"
          />
        </ul>
      </div>
      <div class="right" v-html="data.introduction" ref="text"></div>
    </div>
  </article>
</template>
<script>
import splitLines from '~/assets/js/utils/SplitLines'
import vTag from '~/components/work/tags/tag.vue'
import { mapState } from 'vuex'
export default {
  name: 'workHeader',
  data() {
    return { isListShown: false }
  },
  props: ['data'],
  components: { vTag },
  computed: { ...mapState(['reducedMotion']) },
  methods: {
    tick(scrollTop) {
      if (scrollTop > this.top - this.h * 0.9) {
        if (!this.isListShown) {
          this.show()
        }
      }
      if (scrollTop < this.top - this.h * 0.95) {
        if (this.isListShown) {
          this.reset()
        }
      }
    },
    show() {
      this.isListShown = true
      this.$refs.tags.forEach((el, i) => {
        el.show(i)
      })
      gsap.to(this.lines, {
        translateY: '0%',
        delay: 0.3,
        duration: this.reducedMotion ? 0 : 1,
        stagger: 0.2,
        ease: 'power4.out',
        force3D: true
      })
    },
    reset() {
      this.isListShown = false
      this.$refs.tags.forEach((el, i) => {
        el.reset()
      })
      gsap.killTweensOf(this.lines)
      gsap.set(this.lines, {
        translateY: '100%'
      })
    },
    resize(w, h) {
      this.h = h
      this.top = this.$el.getBoundingClientRect().top
    }
  },
  mounted() {
    this.$nextTick(() => {
      splitLines(this.$refs.text.querySelector('p'))
      this.lines = this.$el.querySelectorAll('p .inner') || []
      this.reset()
    })
  }
}
</script>
<style lang="scss">
article {
  padding: vw(20) 0 $space100;
  position: relative;
  > div {
    display: flex;
  }
  .line {
    overflow: hidden;
    display: block;
    .inner {
      display: block;
    }
  }
  .tags {
    flex: 1;
  }
  .right {
    flex: 2;
  }
  h2 {
    width: 50%;
    margin-bottom: vw(30);
    text-transform: uppercase;
  }
  @include below(medium) {
    > div {
      display: block;
    }
    h2 {
      margin-bottom: vwM(20);
    }
    .right {
      margin-top: vwM(30);
    }
    padding: vwM(20) 0 $space100M;
  }
}
</style>
