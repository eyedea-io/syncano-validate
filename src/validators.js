import { is } from './helpers'

export function validateRequired(attribute, value) {
  return is.existy(value) && is.not.empty(value)
}

export function validateMin(attribute, value, parameters) {
  this.requireParameterCount(1, parameters, 'min')

  if (is.not.number(parameters[0])) {
    throw new Error('Validation rule min requires number parameter.')
  }

  return this.getSize(attribute, value) >= parameters[0]
}

export function validateExists(attribute, value, parameters) {
  this.requireParameterCount(2, parameters, 'exists')

  const [className, column] = parameters

  return new Promise((resolve, reject) => {
    this.connection.DataObject.please()
      .list({ className })
      .filter({ [column]: { _eq: value } })
      .count()
      .then(response => {
        resolve(response.objects_count > 0)
      })
      .catch(err => {
        reject(err.message)
      })
  })
}

export function validateNumeric(attribute, value) {
  return !isNaN(parseFloat(value)) && isFinite(value)
}

export function validateArray(attribute, value) {
  return is.array(value)
}
