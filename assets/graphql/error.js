import seo from './fragments/seo'
import image from './fragments/image'
export default `query errorPageQuery {
  errorPage {
    ${seo}
    image{
      ${image}
    }
  }
}`
