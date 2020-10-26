import getData from '~/assets/js/utils/datas/getData'
const getAsyncData = async (context, query, name = '', variables = {}) => {
  const dataName = name !== '' ? name : context.route.name
  if (process.server && process.env.NODE_ENV === 'production') {
    var getQuery = require('~/assets/js/utils/datas/getQuery')
    const data = await getQuery.default(query, variables, dataName)
    if (!data) return
    var storeJson = require('~/assets/js/utils/datas/storeJson')
    await storeJson.default(dataName, data)
    return data
  }

  return getData(dataName)
}
export default getAsyncData
