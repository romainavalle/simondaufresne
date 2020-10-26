<template>
  <section class="errorPage">
    <v-scene-about :img="errorPage.image" ref="scene" />
    <div class="top top--centered" ref="top">
      <div>
        <v-title ref="title" tag="h1" text="Page not found" />
      </div>
    </div>
  </section>
</template>
<script>
import emitter from '~/assets/js/events/EventsEmitter'
import errorPageQuery from '~/assets/graphql/error.js'
import getAsyncData from '~/assets/js/utils/datas/getAsyncData'
import head from '~/assets/js/head'
import vTitle from '~/components/common/title.vue'
import vSceneAbout from '~/components/scene/scene-about.vue'
import { mapState } from 'vuex'
export default {
  name: 'errorPage',
  async asyncData(context) {
    return getAsyncData(context, errorPageQuery, 'custom404')
  },
  head() {
    return head(this.errorPage.seo)
  },
  computed: {
    ...mapState(['isDark'])
  },
  components: {
    vSceneAbout,
    vTitle
  },
  methods: {
    resize(w, h) {
      this.h = h
      this.els.forEach((element) => {
        element.resize(w, h)
      })
    },
    tick(scrollTop) {
      this.els.forEach((element) => {
        element.tick(scrollTop)
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.els = [this.$refs.scene, this.$refs.title]
      emitter.emit('PAGE:MOUNTED')
    })
  }
}
</script>

<style lang="scss">
.errorPage {
  h1 {
    text-align: center;
    width: 65%;
    margin: 0 auto;
  }
  .top p {
    text-align: center;
    margin: $space60 auto 0;
    width: 70%;
    font-size: vw(24);
    .line,
    .inner {
      display: block;
      overflow: hidden;
    }
  }
  @include below(medium) {
    .top p {
      font-size: vwM(16);
    }
  }
}
</style>
