import seo from './fragments/seo'
import image from './fragments/image'
export default `query worksPageQuery {
  worksPage {
    ${seo}
    works {
      slug
      title
      hero{
        ${image}
      }
      color {
        hex
      }
    }
  }
}`
