import is from 'is_js'
import snakeCase from 'lodash.snakecase'
import camelCase from 'lodash.camelcase'

export function isSyncanoServer() {
  return Boolean(global.ARGS)
}

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
