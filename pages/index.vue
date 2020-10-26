<template>
  <section class="homePage">
    <div class="top" ref="top">
      <h1>Simon Daufresne</h1>
      <p v-html="homePage.introduction" ref="text"></p>
      <ul class="socials">
        <li
          v-for="(link, i) in homePage.links"
          :key="`link-${i}`"
          ref="socials"
        >
          <a
            :href="link.url"
            v-text="link.label"
            rel="noopener noreferrer"
            target="_blank"
          ></a>
        </li>
      </ul>
    </div>
    <v-next ref="next" />
  </section>
</template>
<script>
import splitLines from '~/assets/js/utils/SplitLines'
import emitter from '~/assets/js/events/EventsEmitter'
import indexPageQuery from '~/assets/graphql/index.js'
import getAsyncData from '~/assets/js/utils/datas/getAsyncData'
import head from '~/assets/js/head'
import vNext from '~/components/next/projects.vue'
import transform from 'dom-transform'
import { mapState } from 'vuex'
export default {
  name: 'indexPage',
  async asyncData(context) {
    return getAsyncData(context, indexPageQuery)
  },
  head() {
    return head(this.homePage.seo)
  },
  computed: { ...mapState(['isLoaderAnimationDone', 'reducedMotion']) },
  components: { vNext },
  methods: {
    resize(w, h, ph) {
      this.h = h
      this.els.forEach((element) => {
        element.resize(w, h, ph)
      })
    },
    tick(scrollTop) {
      this.els.forEach((element) => {
        element.tick(scrollTop)
      })
      this.$refs.top.style.opacity = 1 - Math.min(1, scrollTop / this.h)
      transform(this.$refs.top, { translate3d: [0, scrollTop * 0.25, 0] })
    },
    doPageTransition() {
      this.$refs.next.doPageTransition()
    }
  },
  mounted() {
    this.$nextTick(() => {
      emitter.emit('PAGE:MOUNTED')
      this.els = [this.$refs.next]
      splitLines(this.$refs.text)
      this.stagger = [].slice.call(this.$refs.text.querySelectorAll('.inner'))
      gsap.fromTo(
        this.stagger,
        { y: '100%' },
        {
          y: '0%',
          ease: 'power4.out',
          force3D: true,
          duration: this.reducedMotion ? 0 : 1.6,
          delay: this.isLoaderAnimationDone ? 0.2 : 1.5,
          stagger: {
            amount: 0.4,
            ease: 'power2.out'
          }
        }
      )
      gsap.fromTo(
        this.$refs.text,
        { y: '30%' },
        {
          y: '0%',
          ease: 'power4.out',
          force3D: true,
          duration: this.reducedMotion ? 0 : 2,
          delay: this.isLoaderAnimationDone ? 0.2 : 1.5
        }
      )
      gsap.fromTo(
        this.$refs.socials,
        { y: '100%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          ease: 'power4.out',
          force3D: true,
          duration: this.reducedMotion ? 0 : 1.2,
          delay: this.isLoaderAnimationDone ? 1.3 : 3,
          stagger: 0.2
        }
      )
    })
  }
}
</script>

<style lang="scss">
.homePage {
  h1 {
    display: none;
  }
  p {
    text-align: center;
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    font-family: $orpheus;
    font-size: vw(74);
    line-height: 1.2;
    transform: translate(-50%, -50%);
    .line,
    .inner {
      display: block;
      overflow: hidden;
    }
  }
  .socials {
    display: flex;
    justify-content: center;
    position: absolute;
    bottom: vw(40);
    left: 50%;
    transform: translateX(-50%);
    li + li {
      margin-left: vw(20);
    }
    font-size: vw(22);
    font-family: $orpheus;
    a {
      transition: opacity 0.3s $ease-in-out-quad;
      &:hover {
        opacity: 0.4;
      }
    }
  }

  @include below(medium) {
    p {
      font-size: vwM(38);
    }
    .socials {
      display: none;
    }
  }
}
</style>
