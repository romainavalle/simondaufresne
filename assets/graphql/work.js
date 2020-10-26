import seo from './fragments/seo'
import image from './fragments/image'
export default `query workPageQuery($slug: String!){
  work(filter: {slug: {eq: $slug}}) {
    ${seo}
    title
    introduction
    hero {
      ${image}
    }
    color {
      hex
    }
    tags {
      label
    }
    contents {
      ... on SingleLargeRecord {
        __typename
        isParallax
        media{
          ${image}
        }
      }
      ... on SingleMediumRecord {
        __typename
        media{
          ${image}
        }
      }
      ... on DuoRecord {
        __typename
        addMargin
        mediaLeft{
          ${image}
        }
        mediaRight{
          ${image}
        }
      }
      ... on ImgTextRecord {
        __typename
        media{
          ${image}
        }
        title
        text
        hasBackground
      }
      ... on TrioRecord {
        __typename
        media1{
          ${image}
        }
        media2{
          ${image}
        }
        media3{
          ${image}
        }
      }
    }
  }
}`
