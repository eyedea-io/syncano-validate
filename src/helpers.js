import is from 'is_js'
import snakeCase from 'lodash.snakecase'
import camelCase from 'lodash.camelcase'

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

export {
  snakeCase,
  camelCase,
  studlyCase,
  upperFirst,
  coerce,
  is
}
