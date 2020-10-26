import slugsQuery from './assets/graphql/slugs.js'
import getQuery from './assets/js/utils/datas/getQuery.js'
const getRoutes = async () => {
  return getQuery(slugsQuery, {}, 'slugsQuery').then(({ allWorks }) => {
    const routes = []
    allWorks.forEach((obj) => {
      routes.push('/work/' + obj.slug)
    })
    return routes
  })
}
export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover'
      }
    ],
    link: [
      {
        rel: 'preconnect',
        href: 'https://simon-daufresne.s3.eu-central-1.amazonaws.com'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [{ src: '~/assets/scss/main.scss', lang: 'scss' }],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~plugins/vuex-router-sync.js',
    '~plugins/plugins.client.js',
    '~plugins/pwa.client.js'
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/sitemap',
    '@nuxtjs/svg'
  ],
  pwa: {
    workbox: {
      clientsClaim: false,
      cachingExtensions: '@/plugins/workbox-range-request.js'
    }
  },

  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/style-resources'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config) {
      config.module.rules.push({
        test: /\.(glsl|frag|vert|fs|vs)$/,
        loader: 'shader-loader',
        exclude: /(node_modules)/
      })
    }
  },

  router: {
    extendRoutes(routes, resolve) {
      routes.push(
        {
          name: 'custom404',
          path: '*',
          component: resolve(__dirname, 'pages/404.vue')
        },
        {
          name: 'work404',
          path: '/work/*',
          component: resolve(__dirname, 'pages/404.vue')
        }
      )
    }
  },
  generate: {
    concurrency: 1,
    routes: getRoutes
  },
  styleResources: {
    scss: ['~/assets/scss/includes.scss']
  }
}
