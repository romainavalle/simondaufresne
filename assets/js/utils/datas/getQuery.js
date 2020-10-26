import { GraphQLClient } from 'graphql-request'
import config from './../../../../.datocms' // cause use in nuxt.config.js
const cache = new Map()
const getQuery = async (query, variables = {}, dataName) => {
  if (cache.get(dataName)) {
    return cache.get(dataName)
  }
  return new Promise(async (resolve, reject) => {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${config.token}`
    }
    const graphQLClient = new GraphQLClient(config.httpEndpoint, {
      headers
    })

    graphQLClient
      .request(query, variables)
      .then((response) => {
        cache.set(dataName, response)
        resolve(response)
      })
      .catch((e) => {
        reject(e)
        throw e
      })
  })
}

export default getQuery
