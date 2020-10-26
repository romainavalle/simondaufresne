import seo from './fragments/seo'
import image from './fragments/image'
export default `query aboutPageQuery {
  aboutPage {
    ${seo}
    title
    introduction
    hero{
      ${image}
    }
    clients {
      name
    }
    awards {
      title
      year
      award
    }
    links {
      label
      url
    }
  }
}`
