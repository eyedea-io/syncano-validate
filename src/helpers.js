import is from 'is_js'
import snakeCase from 'lodash.snakecase'
import camelCase from 'lodash.camelcase'
import fetch from 'isomorphic-fetch'

require('es6-promise').polyfill()

const baseUrl = 'https://api.syncano.rocks/v2/instances/'

function upperFirst(str) {
  const firstLetter = str.substr(0, 1)
  return firstLetter.toUpperCase() + str.substr(1)
}

function coerce(value) {
  return is.number(Number(value)) ? Number(value) :
         value === 'true' ? true :
         value === 'false' ? false : value
}

function studlyCase(str) {
  return upperFirst(camelCase(str))
}

function get(endpoint, query) {
  console.log(url(endpoint, query))
  return fetch(url(endpoint, query), {
    method: 'GET',
    headers: {
      'X-API-KEY': '',
      'Content-Type': 'application/json'
    }
  }).then(response => {
    return response.json()
  }).catch(err => {
    return err
  })
}

function url(endpoint, query) {
  const url = `${baseUrl}${process.env.SYNCANO_INSTANCE_NAME}/${endpoint}`

  query = JSON.stringify(query)

  return query ? `${url}?query=${query}` : url
}

export {
  snakeCase,
  camelCase,
  studlyCase,
  upperFirst,
  coerce,
  is,
  get,
  url
}
