<template>
  <section class="worksPage">
    <h2>Projects</h2>
    <client-only>
      <nav class="links">
        <v-work
          v-for="(work, i) in worksPage.works"
          :key="`work-${i}`"
          :data="work"
        />
      </nav>
    </client-only>
    <ul ref="works" class="c c--1000">
      <li ref="first">
        <div class="works-container">
          <v-work
            v-for="(work, i) in getWork(0)"
            :key="`work-${i}`"
            :data="work"
            @clicked="clicked(0)"
          />
        </div>
      </li>
      <li>
        <div class="works-container">
          <v-work
            v-for="(work, i) in getWork(1)"
            :key="`work-${i * 2}`"
            :data="work"
            @clicked="clicked(1)"
          />
        </div>
      </li>
      <li ref="last">
        <div class="works-container">
          <v-work
            v-for="(work, i) in getWork(2)"
            :key="`work-${i * 3}`"
            :data="work"
            @clicked="clicked(2)"
          />
        </div>
      </li>
    </ul>
  </section>
</template>
<script>
import emitter from '~/assets/js/events/EventsEmitter'
import indexPageQuery from '~/assets/graphql/works.js'
import getAsyncData from '~/assets/js/utils/datas/getAsyncData'
import head from '~/assets/js/head'

import vWork from '~/components/works/work.vue'
import transform from 'dom-transform'
import { mapState } from 'vuex'
export default {
  name: 'indexPage',
  async asyncData(context) {
    return getAsyncData(context, indexPageQuery)
  },
  head() {
    return head(this.worksPage.seo)
  },
  data() {
    return { scrollTop: 0 }
  },
  computed: { ...mapState(['reducedMotion', 'isLoaderAnimationDone']) },
  components: { vWork },
  methods: {
    clicked(id) {
      this.$el.style.pointerEvents = 'none'
      this.$el.querySelectorAll('li')[id].style.zIndex = 5
    },
    getWork(modulo) {
      return this.worksPage.works.filter((el, i) => {
        return i % 3 === modulo
      })
    },
    resize(w, h) {
      this.h = h
      this.w = w
    },
    tick(scrollTop) {
      this.scrollTop = scrollTop
      const coef = scrollTop / (this.h * 2)
      if (this.w >= 420) {
        transform(this.$refs.first, {
          translate3d: [0, coef * this.h * 0.4, 0]
        })
        transform(this.$refs.last, {
          translate3d: [0, -coef * this.h * 0.2, 0]
        })
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      emitter.emit('PAGE:MOUNTED')
      const stagger = [].slice.call(
        this.$el.querySelectorAll('.works-container')
      )
      const links = this.$el.querySelector('.links')
      if (stagger) {
        gsap.fromTo(
          stagger,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: this.reducedMotion ? 0 : 1.5,
            stagger: 0.3,
            delay: this.isLoaderAnimationDone ? 0 : 1.5,
            ease: 'power4.out'
          }
        )
      }
    })
  }
}
</script>

<style lang="scss">
.worksPage {
  padding-bottom: 0vh;
  > h2 {
    display: none;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  li {
    width: 26%;
  }
  .works-container {
    opacity: 0;
  }
  li:nth-child(1) {
    margin-top: 35vh;
  }
  li:nth-child(2) {
    margin-top: 15vh;
  }
  li:nth-child(3) {
    margin-top: 55vh;
  }
  .links {
    display: none;
  }
  @include below(medium) {
    padding-bottom: 0;
    .links {
      margin-top: 25vh;
      padding-bottom: 25vh;
      display: block;
      width: 60%;
      margin-left: auto;
      margin-right: auto;
    }
    ul {
      display: none;
    }
    article:nth-child(2n) {
      margin-right: vwM(50);
    }
    article:nth-child(2n + 1) {
      margin-left: vwM(50);
    }
  }
}
</style>
