<template>
  <section class="work">
    <div class="work-container">
      <v-top ref="top" :work="work"></v-top>
      <v-header :data="work" ref="header" />
      <v-component-loader
        v-for="(content, i) in work.contents"
        :data="content"
        ref="contents"
        :key="`content-${i}`"
      ></v-component-loader>
    </div>

    <v-next ref="next" />
  </section>
</template>
<script>
import workQuery from '~/assets/graphql/work.js'
import getAsyncData from '~/assets/js/utils/datas/getAsyncData'
import head from '~/assets/js/head'
import emitter from '~/assets/js/events/EventsEmitter'
import vHeader from '~/components/work/header.vue'
import vComponentLoader from '~/components/componentLoader.vue'
import vNext from '~/components/next/projects.vue'
import vTop from '~/components/work/top.vue'
export default {
  async asyncData(context) {
    return getAsyncData(context, workQuery, context.route.params.slug, {
      slug: context.route.params.slug
    })
  },
  head() {
    return head(this.work.seo)
  },
  components: { vHeader, vComponentLoader, vNext, vTop },
  methods: {
    resize(w, h, ph) {
      this.els.forEach((element) => {
        element.resize(w, h, ph)
      })
    },
    tick(scrollTop) {
      this.els.forEach((element) => {
        element.tick(scrollTop)
      })
    },
    doPageTransition() {
      this.$refs.next.doPageTransition()
    }
  },
  mounted() {
    this.$nextTick(() => {
      emitter.emit('PAGE:MOUNTED')
      this.els = [
        this.$refs.header,
        ...this.$refs.contents,
        this.$refs.next,
        this.$refs.top
      ]
    })
  }
}
</script>

<style lang="scss">
.work-container {
  position: relative;
  z-index: 1;
}
</style>
