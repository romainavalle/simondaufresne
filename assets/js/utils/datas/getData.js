import { get } from 'axios'
let cache = new Map()
const getData = async (name) => {
  return new Promise((resolve) => {
    const url = `${
      process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : ''
    }/api/${name}/index.json`
    let res = cache.get(url)
      ? cache.get(url)
      : get(url, { port: 3000 })
          .then((json) => {
            cache.set(url, json.data)
            return json.data
          })
          .catch((e) => {
            window.location.href = '/404'
          })

    resolve(res)
  })
}

export default getData
