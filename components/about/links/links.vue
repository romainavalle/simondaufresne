<template>
  <div class="links">
    <v-link
      v-for="(link, i) in links"
      :id="i"
      :key="`link-${i}`"
      :link="link"
      ref="links"
    />
  </div>
</template>
<script>
import vLink from '~/components/about/links/link.vue'
export default {
  name: 'links',
  data() {
    return {}
  },
  props: ['links'],
  components: { vLink },
  methods: {
    tick(scrollTop) {
      this.$refs.links.forEach((el) => {
        el.tick(scrollTop)
      })
    },
    resize(w, h) {
      this.$refs.links.forEach((el) => {
        el.resize(w, h)
      })
    }
  },
  mounted() {}
}
</script>
<style lang="scss">
.links {
  margin-top: $space100;

  @include below(medium) {
    margin-top: $space60M;
  }
}
</style>
