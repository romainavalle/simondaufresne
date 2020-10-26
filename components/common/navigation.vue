<template>
  <nav class="navigation">
    <nuxt-link
      :to="{ name: 'index' }"
      class="home"
      @click.native="onLogoClicked"
      @mouseenter.native="onEnter"
      ><v-logo
    /></nuxt-link>
    <nuxt-link :to="{ name: 'work' }" class="projects"
      >Projects
      <svg class="hover" viewBox="0 0 84 60">
        <ellipse cx="42" cy="30" rx="40" ry="28" stroke-width="1.5" /></svg
    ></nuxt-link>
    <nuxt-link :to="{ name: 'about' }" class="about"
      >About
      <svg class="hover" viewBox="0 0 80 56">
        <ellipse cx="40" cy="28" rx="38" ry="26" stroke-width="1.5" /></svg
    ></nuxt-link>
    <transition name="fade">
      <button
        class="u-scroll"
        v-show="showScroll"
        @click="doScroll"
        v-if="$route.name === 'index'"
      >
        <span class="u-scroll-inner">
          Scroll
          <svg class="hover" viewBox="0 0 70 60">
            <ellipse cx="35" cy="30" rx="33" ry="28" stroke-width="1.5" />
          </svg>
        </span>
      </button>
    </transition>
    <client-only>
      <div class="top " ref="top">
        <div class="inner" ref="inner">
          <nuxt-link
            :to="{ name: 'index' }"
            class="home"
            @click.native="onLogoClicked"
            @mouseenter.native="onEnter"
            ><v-logo
          /></nuxt-link>
          <nuxt-link :to="{ name: 'work' }" class="projects"
            >Projects<svg class="hover" viewBox="0 0 84 60">
              <ellipse
                cx="42"
                cy="30"
                rx="40"
                ry="28"
                stroke-width="1.5"
              /></svg
          ></nuxt-link>
          <nuxt-link :to="{ name: 'about' }" class="about"
            >About
            <svg class="hover" viewBox="0 0 80 56">
              <ellipse
                cx="40"
                cy="28"
                rx="38"
                ry="26"
                stroke-width="1.5"
              /></svg
          ></nuxt-link>
        </div>
      </div>
    </client-only>
  </nav>
</template>
<script>
import vLogo from '~/assets/svgs/logo.svg?inline'
import transform from 'dom-transform'
import ScrollHelper from '~/assets/js/utils/ScrollHelper'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'navigation',
  data() {
    return {
      showScroll: true
    }
  },
  components: { vLogo },
  computed: {
    hasNextSection() {
      return this.$route.name == 'index'
    },
    ...mapGetters(['isTouch']),
    ...mapState(['reducedMotion'])
  },
  methods: {
    ...mapActions(['swapColor']),
    onLogoClicked() {
      if (this.$route.name === 'index') {
        this.swapColor()
      }
    },
    doScroll() {
      ScrollHelper.scrollTo(this.h)
    },
    onEnter() {
      if (this.isEntered) return
      if (this.isTouch) return
      if (this.reducedMotion) return
      this.isEntered = true
      const svgs = [].slice.call(this.$el.querySelectorAll('.home svg'))
      gsap
        .to(svgs, {
          opacity: 0,
          scale: 0.5,
          force3D: true,
          ease: 'power4.out',
          duration: this.reducedMotion ? 0 : 0.2
        })
        .then(() => {
          gsap
            .fromTo(
              svgs,
              { opacity: 1, scale: 1, x: -this.w * 0.1 },
              {
                x: 0,
                ease: 'power4.out',
                force3D: true,
                duration: this.reducedMotion ? 0 : 0.5
              }
            )
            .then(() => {
              this.isEntered = false
            })
        })
    },
    tick(scrollTop) {
      if (scrollTop > this.h * 0.1) {
        if (this.showScroll) this.showScroll = false
      } else {
        if (!this.showScroll) this.showScroll = true
      }
      const h = window.innerHeight

      if (this.hasNextSection) {
        transform(this.$refs.top, { translate3d: [0, h - scrollTop, 0] })
        transform(this.$refs.inner, { translate3d: [0, scrollTop - h, 0] })
      } else {
        transform(this.$refs.top, { translate3d: [0, h, 0] })
        transform(this.$refs.inner, { translate3d: [0, -h, 0] })
      }
    },
    resize(w, h, ph) {
      this.w = w
      this.h = h
      this.ph = ph
      this.top = this.ph - this.h - this.h
    }
  },
  watch: {
    $route() {
      this.$nextTick(() => {
        this.$nextTick(() => {
          const ellipses = [].slice.call(this.$el.querySelectorAll('ellipse'))
          ellipses.forEach((element) => {
            let length = element.getTotalLength()
            element.style.strokeDashoffset = length
            element.style.strokeDasharray = length
          })
          this.$nextTick(() => {
            ellipses.forEach((element) => {
              element.classList.add('animate')
            })
          })
        })
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$nextTick(() => {
        const ellipses = [].slice.call(this.$el.querySelectorAll('ellipse'))
        ellipses.forEach((element) => {
          let length = element.getTotalLength()
          element.style.strokeDashoffset = length
          element.style.strokeDasharray = length
        })
        this.$nextTick(() => {
          ellipses.forEach((element) => {
            element.classList.add('animate')
          })
        })
      })
    })
    this.$el.style.opacity = 1
    const stagger = [
      this.$el.querySelector('.projects'),
      this.$el.querySelector('.about')
    ]
    if (this.$el.querySelector('.u-scroll-inner'))
      stagger.push(this.$el.querySelector('.u-scroll-inner'))
    gsap.fromTo(
      stagger,
      { opacity: 0 },
      {
        opacity: 1,
        delay: 1,
        duration: this.reducedMotion ? 0 : 2,
        stagger: 0.6,
        ease: 'power2.out',
        clearProps: 'all'
      }
    )
  }
}
</script>
<style lang="scss">
.navigation {
  position: fixed;
  top: 0;
  opacity: 0;
  width: 100vw;
  font-size: vw(14);
  height: 100vh;
  min-height: 100vh;
  min-height: -webkit-fill-available;
  pointer-events: none;
  z-index: 5;
  button:hover ellipse,
  a:hover ellipse,
  .nuxt-link-exact-active ellipse {
    stroke-dashoffset: 0 !important;
  }

  ellipse.animate {
    transition: stroke-dashoffset 0.5s $ease-in-out-quart;
  }
  .reduced-motion & ellipse.animate {
    transition: none;
  }

  .top,
  .inner {
    overflow: hidden;
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
  }
  a,
  button {
    color: currentColor;
    pointer-events: auto;
  }
  .home {
    position: absolute;
    top: vw(40);
    left: vw(40);
    width: vw(45);
    height: vw(60);

    svg {
      display: block;
      fill: currentColor;
    }
  }
  a.about {
    bottom: vw(-20);
    left: vw(35);
    transform-origin: 0% 0%;
    transform: rotate(-90deg);
  }
  button.u-scroll {
    bottom: vw(10);
    cursor: pointer;
    right: vw(55);
    transform-origin: 0% 50%;
    transform: translateX(100%) rotate(-90deg);
    .u-scroll-inner {
      display: block;
      position: relative;
    }
  }
  a.projects {
    right: vw(35);
    top: vw(40);
  }
  button.u-scroll,
  a.projects,
  a.about {
    position: absolute;
    font-weight: normal;
    display: block;
    line-height: 1;
    .hover {
      display: block;
      position: absolute;
      height: 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(-1, -1);
      fill: none;
      stroke: currentColor;
    }
  }
  a.projects {
    padding: vw(22) vw(16) vw(22);
  }
  a.about {
    padding: vw(21) vw(16) vw(23);
  }
  .u-scroll-inner {
    padding: vw(21) vw(16) vw(21) vw(16);
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  @include below(medium) {
    font-size: vwM(14);
    .hover {
      display: none;
    }

    .home {
      top: vwM(30);
      left: vwM(20);
      width: vwM(45);
      height: vwM(60);
    }
    a.about {
      bottom: vwM(-28);
      left: vwM(10);
    }
    button.u-scroll {
      bottom: vwM(0);
      right: vwM(30);
    }
    a.projects {
      right: vwM(10);
      top: vwM(30);
    }
    a.projects {
      padding: vwM(22) vwM(16) vwM(22);
    }
    a.about {
      padding: vwM(21) vwM(16) vwM(23);
    }
    .u-scroll-inner {
      padding: vwM(21) vwM(16) vwM(21) vwM(16);
    }
  }
}
</style>
