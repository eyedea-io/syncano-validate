import * as replacers from './replacers'
import * as validators from './validators'
import { is, coerce, snakeCase, studlyCase } from './helpers'
import MESSAGES from './messages'

export default class Validator {
  constructor(data, rules = {}, messages = {}) {
    this.messages = messages
    this.setData(data)
    this.setRules(rules)

    this.numericRules = ['Numeric', 'Integer']
    this.sizeRules = ['Min', 'Max', 'Between']
  }

  setRules(rules) {
    this.rules = Object.keys(rules).reduce((all, attr) => ({
      ...all,
      [attr]: rules[attr].split('|')
    }), {})
  }

  setData(data) {
    // TODO: Handle array inputs
    this.data = data
  }

  validate() {
    if (this.fails()) {
      // TODO: throw list of errors
      throw new ValidationError('Validation failed.', this.errors)
    }
  }

  fails() {
    return !this.passes()
  }

  passes() {
    this.errors = {}

    Object.keys(this.rules).map(attribute =>
      this.rules[attribute].forEach(rule => {
        // Skip invalidated attributes
        if (!{}.hasOwnProperty.call(this.errors, attribute)) {
          this.validateAttribute(attribute, rule)
        }
      })
    )

    return Object.keys(this.errors).length === 0
  }

  errors() {
    return this.errors
  }

  validateAttribute(attribute, stringRule) {
    const { rule, parameters } = this.parseRule(stringRule)

    if (rule === '') {
      return
    }

    // TODO: Handle file input
    const value = this.data[attribute]
    const method = validators[`validate${rule}`]

    if (method && !method.call(this, attribute, value, parameters)) {
      this.addError(attribute, rule, parameters)
    }
  }

  parseRule(rule) {
    let parameters = []

    if (rule.indexOf(':') >= 0) {
      parameters = rule.split(':')
      rule = parameters.shift()
    }

    parameters = parameters.map(coerce)

    rule = studlyCase(rule)
    rule = rule === 'Int' ? 'Integer' :
           rule === 'Bool' ? 'Boolean' : rule

    return { rule, parameters }
  }

  addError(attribute, rule, parameters) {
    let message = this.getMessage(attribute, rule)

    message = this.doReplacements(message, attribute, rule, parameters)

    this.errors[attribute] = message
  }

  getMessage(attribute, rule) {
    // TODO: Handle custom messages
    const lowerRule = snakeCase(rule)
    let message = MESSAGES[lowerRule]

    if (this.sizeRules.indexOf(rule) >= 0) {
      const type = this.hasRule(attribute, this.numericRules) ? 'numeric' :
                   this.hasRule(attribute, ['Array']) ? 'array' : 'string'

      message = message[type]
    }

    return message
  }

  hasRule(attribute, rules) {
    return this.getRule(attribute, rules) !== undefined
  }

  getRule(attribute, rules) {
    if (!{}.hasOwnProperty.call(this.rules, attribute)) {
      return false
    }

    for (const value of this.rules[attribute]) {
      const { rule, parameters } = this.parseRule(value)

      if (rules.indexOf(rule) >= 0) {
        return [rule, parameters]
      }
    }
  }

  doReplacements(message, attribute, rule, parameters) {
    const replacer = replacers[`replace${rule}`]
    const formatedAttribute = snakeCase(attribute).replace('_', ' ')

    message = message.replace(':attribute', formatedAttribute)

    if (replacer) {
      message = replacer.call(this, message, attribute, rule, parameters)
    }

    return message
  }

  requireParameterCount(count, parameters, rule) {
    if (parameters.length < count) {
      throw new ValidationError(`Validation rule ${rule} requires at least ${count} parameters.`)
    }
  }

  getSize(attribute, value) {
    const hasNumeric = this.hasRule(attribute, this.numericRules)

    if (is.number(value) && hasNumeric) {
      return value
    } else if (Array.isArray(value)) {
      return value.length
    }

    // TODO: Handle file size

    return String(value).length
  }
}

export function ValidationError(message, errors) {
  this.stack = (new Error()).stack
  this.name = 'ValidationError'
  this.message = message
  this.errors = errors
}

export function validate(data, rules) {
  return (new Validator(data, rules)).validate()
}
