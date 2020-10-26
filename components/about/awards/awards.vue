<template>
  <div class="awards">
    <v-title tag="h2" ref="title" direction="inverse" text="Awards" />
    <ol class="c c--1000" ref="list">
      <v-award
        v-for="(award, i) in awards"
        :key="`award-${i}`"
        :award="award"
        :id="i"
        ref="awards"
      />
    </ol>
  </div>
</template>
<script>
import vTitle from '~/components/common/title.vue'
import vAward from '~/components/about/awards/award.vue'
export default {
  name: 'awards',
  data() {
    return { isListShown: false }
  },
  props: ['awards'],
  components: { vAward, vTitle },
  methods: {
    tick(scrollTop) {
      this.$refs.title.tick(scrollTop)
      if (scrollTop > this.top - this.h * 0.8) {
        if (!this.isListShown) {
          this.isListShown = true
          this.$refs.awards.forEach((el, i) => {
            el.show(i)
          })
        }
      }
      if (scrollTop < this.top - this.h) {
        if (this.isListShown) {
          this.isListShown = false
          this.$refs.awards.forEach((el, i) => {
            el.reset()
          })
        }
      }
    },
    resize(w, h) {
      this.h = h
      this.$refs.title.resize(w, h)
      this.top = this.$refs.list.getBoundingClientRect().top
    }
  },
  mounted() {}
}
</script>
<style lang="scss">
.awards {
  margin-top: $space60;
  ol {
    padding-top: $space60;
  }
  @include below(medium) {
    margin-top: $space60M;
    ol {
      padding-top: $space60M;
    }
  }
}
</style>
