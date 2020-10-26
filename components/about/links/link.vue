<template>
  <div class="link">
    <a :href="link.url" class="h1" rel="noopener" target="_blank">
      <v-title
        tag="span"
        ref="title"
        :direction="id % 2 === 0 ? 'inverse' : 'regular'"
        :text="link.label"
      />
    </a>
  </div>
</template>
<script>
import vTitle from '~/components/common/title.vue'
export default {
  name: 'vLink',
  data() {
    return {}
  },
  components: { vTitle },
  props: ['link', 'id'],
  methods: {
    tick(scrollTop) {
      this.$refs.title.tick(scrollTop)
    },
    resize(w, h) {
      this.$refs.title.resize(w, h)
    }
  },
  mounted() {}
}
</script>
<style lang="scss">
.link {
  display: block;
  text-align: center;
  & + .link {
    margin-top: vw(50);

    @include below(medium) {
      margin-top: vwM(50);
    }
  }
}
</style>
