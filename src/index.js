import is from 'is_js'
import { ucfirst, coerce } from './helpers'

export default class Validator {
  constructor(data, rules = {}, messages = {}) {
    this.messages = messages
    this.setData(data)
    this.setRules(rules)

    this.numericRules = ['integer', 'int', 'numeric']
  }

  setRules(rules) {
    this.rules = Object
      .keys(rules)
      .reduce((all, attr) => {
        all[attr] = rules[attr].split('|')
        return all
      }, {})
  }

  setData(data) {
    // TODO: Handle array inputs
    this.data = data
  }

  validate() {
    if (this.fails()) {
      // TODO: throw list of errors
      throw new ValidationError()
    }
  }

  fails() {
    return !this.passes()
  }

  passes() {
    this.errors = {}

    Object
      .keys(this.rules)
      .reduce((all, attr) => {
        this.rules[attr].forEach(rule => this.validateAttribute(attr, rule))

        return all
      }, {})

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
    const method = this[`validate${rule}`]

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

    return {
      rule: ucfirst(rule),
      parameters: parameters.map(coerce)
    }
  }

  addError(attribute, rule, parameters) {
    let message = this.getMessage(attribute, rule)

    message = this.doReplacements(message, attribute, rule, parameters)

    this.errors[attribute] = message
  }

  getMessage(attribute, rule) {
    // TODO
    return [attribute, rule]
  }

  doReplacements(message, attribute, rule, parameters) {
    // TODO: fill message template
    return [message, attribute, rule, parameters]
  }

  requireParameterCount(count, parameters, rule) {
    if (parameters.length < count) {
      throw new ValidationError(`Validation rule ${rule} requires at least ${count} parameters.`)
    }
  }

  getSize(attribute, value) {
    if (is.number(value)) {
      return value
    } else if (Array.isArray(value)) {
      return value.length
    }

    // TODO: Handle file size

    return String(value).length
  }

  validateRequired(attribute, value) {
    return is.existy(value) && is.not.empty(value)
  }

  validateMin(attribute, value, parameters) {
    this.requireParameterCount(1, parameters, 'min')

    return this.getSize(attribute, value) >= parameters[0]
  }
}

export function ValidationError(message) {
  this.stack = (new Error()).stack
  this.name = 'ValidationError'
  this.message = message
}

export function validate(data, rules) {
  return (new Validator(data, rules)).validate()
}
