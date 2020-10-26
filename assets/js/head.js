const head = (data) => {
  const seo = {
    title: data && data.title ? data.title : '',
    description: data && data.description ? data.description : '',
    image: data && data.image ? data.image.url : ''
  }
  return {
    title: `${seo.title}`,
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: seo.description
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: seo.description
      },
      {
        hid: 'twitter:description',
        property: 'twitter:description',
        content: seo.description
      },
      {
        hid: `og:title`,
        property: 'og:title',
        content: `${seo.title}`
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: seo.image
      },
      {
        hid: 'twitter:image',
        property: 'twitter:image',
        content: seo.image
      }
    ]
  }
}
export default head
