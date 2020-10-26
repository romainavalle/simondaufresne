import seo from './fragments/seo'
import image from './fragments/image'
export default `query homePageQuery {
  homePage {
    ${seo}
    title
    introduction
    links {
      label
      url
    }
  }
}`
