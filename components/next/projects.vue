<template>
  <div class="next c " :class="$route.name === 'index' ? 'inverse' : ''">
    <strong v-if="$route.name === 'index'" ref="next">Selected Projects</strong>
    <strong v-else ref="next">Next Project</strong>
    <nav class="projects" ref="nav">
      <ol>
        <v-project
          v-for="(project, i) in works"
          :key="`project-${i}`"
          :project="project"
          ref="projects"
        />
      </ol>
    </nav>
    <v-counter
      ref="counter"
      v-if="!this.isSlug"
      @onTimerEnd="doProjectTransition"
    />
  </div>
</template>
<script>
import emitter from '~/assets/js/events/EventsEmitter'
import vProject from '~/components/next/project.vue'
import vCounter from '~/components/next/counter.vue'
import transform from 'dom-transform'
import { mapState, mapGetters } from 'vuex'
import WheelHelper from '~/assets/js/utils/WheelHelper'
export default {
  name: 'projects',
  data() {
    return {
      count: 0,
      scrollTop: 0,
      currentProject: 0,
      isTimerStarted: false
    }
  },
  computed: {
    ...mapState(['allWorks']),
    ...mapGetters(['isTouch']),
    isSlug() {
      return this.$route.params.slug
    },
    works() {
      let arr = []
      if (this.isSlug) {
        let id =
          this.allWorks.indexOf(
            this.allWorks.find((el) => el.slug === this.$route.params.slug)
          ) + 1
        if (id === this.allWorks.length) id = 0
        arr = [this.allWorks[id]]
      } else {
        arr = this.allWorks.slice(0, 3)
      }

      return arr
    }
  },
  components: { vProject, vCounter },
  methods: {
    startTimer() {
      if (this.isSlug) return
      if (this.isTimerStarted) return
      this.resetTransition()
      this.isTimerStarted = true
    },
    resetTransition() {
      this.$refs.counter.startCounter()
    },
    resetTimer() {
      if (this.isSlug) return
      if (!this.isTimerStarted) return
      this.isTimerStarted = false

      this.$refs.counter.resetCounter()
      clearTimeout(this.timer)
    },
    doPageTransition() {
      if (this.$refs.counter) this.$refs.counter.hide()
      this.$refs.projects[this.currentProject].doPageTransition()
    },
    doProjectTransition() {
      if (this.isSlug) return
      emitter.emit('go-next')
      this.$refs.projects[this.currentProject].hide()
      this.currentProject =
        this.currentProject === this.$refs.projects.length - 1
          ? 0
          : this.currentProject + 1
      this.$refs.projects[this.currentProject].show()

      this.$refs.counter.setCurrent(this.currentProject + 1)
      this.timer = setTimeout(this.resetTransition.bind(this), 1000)
    },
    resize(w, h, ph) {
      this.h = h
      this.w = w
      this.ph = ph
      this.top = this.ph - this.h * 2
      if (this.$refs.counter) this.$refs.counter.resize(w, h)
      this.$refs.projects.forEach((element) => {
        element.resize(w, h)
      })
      this.timerTop = this.w < 1000 ? this.h / 1.5 : this.top + this.h * 0.9
    },
    tick(scrollTop) {
      this.scrollTop = scrollTop
      if (!this.isTouch) {
        transform(this.$refs.next, {
          translate3d: ['-50%', scrollTop - (this.ph - this.h), 0]
        })
      }

      if (scrollTop > this.top) {
        this.$refs.projects.forEach((element) => {
          element.tick(scrollTop)
        })
        transform(this.$refs.nav, {
          translate3d: [0, this.h * 0.5 - (this.scrollTop - this.top) * 0.5, 0]
        })
        this.$refs.nav.style.opacity = (this.scrollTop - this.top) / this.h
        if (this.isSlug) {
          this.count += WheelHelper.deltaEase
          if (this.count > 4000) {
            this.count -= 10000
            this.$router.push({
              name: 'work-slug',
              params: { slug: this.works[0].slug }
            })
          }
        }
      }
      if (this.isSlug) return
      if (scrollTop > this.timerTop) {
        this.startTimer()
      } else {
        this.resetTimer()
      }
    }
  },
  beforeDestroy() {
    clearTimeout(this.timer)
    document.removeEventListener('visibilitychange', this._resetTimer)
  },
  mounted() {
    this._resetTimer = this.resetTimer.bind(this)
    document.addEventListener('visibilitychange', this._resetTimer)
    this.$nextTick(() => {
      this.$refs.projects[0].show(0)
    })
  }
}
</script>
<style lang="scss">
.next {
  overflow: hidden;
  height: 100vh;
  min-height: 100vh;
  min-height: -webkit-fill-available;
  width: 100vw;
  .projects {
    position: relative;
    height: 100%;
    width: 100%;
  }
  a {
    display: block;
    text-align: center;
  }

  strong {
    font-size: vw(14);
    display: block;
    position: absolute;
    top: vw(60);
    left: 50%;
    transform: translateX(-50%);
    font-weight: normal;
    @include below(medium) {
      display: none;
    }
  }
}
</style>
