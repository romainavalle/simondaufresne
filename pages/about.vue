<template>
  <section class="aboutPage">
    <h2>About</h2>
    <v-scene-about :img="aboutPage.hero" ref="scene" />

    <div class="top top--centered" ref="top">
      <div>
        <v-title ref="title" tag="h1" :text="aboutPage.title" />
        <p v-html="aboutPage.introduction" ref="text"></p>
      </div>
    </div>
    <figure>
      <v-logo :fill="isDark ? '#1a1a1a' : '#f6eee3'" ref="svg" />
    </figure>
    <v-awards :awards="aboutPage.awards" ref="awards" />
    <v-clients :clients="aboutPage.clients" ref="clients" />
    <v-links :links="aboutPage.links" ref="links" />
    <v-footer ref="footer" />
  </section>
</template>
<script>
import splitLines from '~/assets/js/utils/SplitLines'
import emitter from '~/assets/js/events/EventsEmitter'
import aboutPageQuery from '~/assets/graphql/about.js'
import getAsyncData from '~/assets/js/utils/datas/getAsyncData'
import head from '~/assets/js/head'
import vMedia from '~/components/fragments/media.vue'
import vAwards from '~/components/about/awards/awards.vue'
import vClients from '~/components/about/clients/clients.vue'
import vLinks from '~/components/about/links/links.vue'
import vFooter from '~/components/about/footer.vue'
import vTitle from '~/components/common/title.vue'
import vSceneAbout from '~/components/scene/scene-about.vue'

import transform from 'dom-transform'
import vLogo from '~/assets/svgs/logo.svg?inline'
import { mapState } from 'vuex'
export default {
  name: 'aboutPage',
  async asyncData(context) {
    return getAsyncData(context, aboutPageQuery)
  },
  head() {
    return head(this.aboutPage.seo)
  },
  computed: {
    ...mapState(['isDark', 'reducedMotion', 'isLoaderAnimationDone'])
  },
  components: {
    vSceneAbout,
    vTitle,
    vLogo,
    vMedia,
    vAwards,
    vClients,
    vLinks,
    vFooter
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
      this.$refs.top.style.opacity = 1 - Math.min(1, scrollTop / this.h)
      transform(this.$refs.top, { translate3d: [0, scrollTop * 0.25, 0] })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.els = [
        this.$refs.scene,
        this.$refs.title,
        this.$refs.awards,
        this.$refs.clients,
        this.$refs.links,
        this.$refs.footer
      ]
      splitLines(this.$refs.text)
      this.stagger = [].slice.call(this.$refs.text.querySelectorAll('.inner'))
      emitter.emit('PAGE:MOUNTED')
      this.stagger = [].slice.call(this.$el.querySelectorAll('.top p .inner'))
      gsap.fromTo(
        this.stagger,
        { y: '100%' },
        {
          y: '0%',
          ease: 'power4.out',
          duration: this.reducedMotion ? 0 : 1.2,
          delay: this.isLoaderAnimationDone ? 0 : 1.5,
          stagger: 0.2
        }
      )
    })
  }
}
</script>

<style lang="scss">
.aboutPage {
  h2 {
    display: none;
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
  figure {
    width: 100vw;
    height: 100vh;
    margin: -30vh auto -30vh;
    position: relative;
    svg {
      position: absolute;
      display: none;
      width: 42.525vmin;
      height: 57.1vmin;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  @include below(medium) {
    .top p {
      font-size: vwM(16);
    }
  }
}
</style>
