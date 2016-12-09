import is from 'is_js'

export function validateRequired(attribute, value) {
  return is.existy(value) && is.not.empty(value)
}

export function validateMin(attribute, value, parameters) {
  this.requireParameterCount(1, parameters, 'min')

  return this.getSize(attribute, value) >= parameters[0]
}
