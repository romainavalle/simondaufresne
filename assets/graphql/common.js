import image from './fragments/image'
export default `query commonQuery {

  worksPage {
    works {
      slug
      title
      hero {
        ${image}
      }
      color {
        hex
      }
    }
  }
}`
