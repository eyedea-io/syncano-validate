import is from 'is_js'

export function ucfirst(str) {
  const firstLetter = str.substr(0, 1)
  return firstLetter.toUpperCase() + str.substr(1)
}

export function coerce(value) {
  return is.number(Number(value)) ? Number(value) :
         value === 'true' ? true :
         value === 'false' ? false : value
}

export default {}
