import * as replacers from './replacers'
import * as validators from './validators'
import { is, coerce, snakeCase, studlyCase } from './helpers'
import MESSAGES from './messages'

export default class Validator {
  constructor() {
    this.numericRules = ['Numeric', 'Integer']
    this.sizeRules = ['Min', 'Max', 'Between']
  }

  setData(data) {
    // TODO: Handle array inputs
    // Map attribute to value
    this.data = Object.keys(data).reduce((all, attribute) => ({
      ...all,
      [attribute]: data[attribute].value
    }), {})

    // Map attribute to array of rules
    this.rules = Object.keys(data).reduce((all, attribute) => ({
      ...all,
      [attribute]: this.parseRules(data[attribute].validate)
    }), {})
  }

  parseRules(rules) {
    return rules.split('|').map(rule => this.parseRule(rule))
  }

  parseRule(rule) {
    let parameters = []

    if (rule.indexOf(':') >= 0) {
      parameters = rule.split(':')
      rule = parameters.shift()
      parameters = parameters.join('').split(',').map(coerce)
    }

    rule = this.normalizeRule(rule)

    this.validateRule(rule)

    return { rule, parameters }
  }

  validateRule(rule) {
    if (validators[`validate${rule}`] === undefined) {
      throw new ValidationError(`Invalid validation rule ${snakeCase(rule)}`)
    }
  }

  normalizeRule(rule) {
    rule = studlyCase(rule)

    return rule === 'Int' ? 'Integer' :
           rule === 'Bool' ? 'Boolean' : rule
  }

  validate(data) {
    return new Promise((resolve, reject) => {
      try {
        this.setData(data)
      } catch (err) {
        reject(err)
      }

      Promise
        .all(this.attributesPass())
        .then(() => this.passes() ? resolve() : reject(this.errors))
        .catch(() => {})
    })
  }

  passes() {
    return Object.keys(this.errors).length === 0
  }

  attributesPass() {
    this.errors = {}

    const rulesToResolve = Object
      .keys(this.rules)
      .reduce((all, attribute) => {
        this.rules[attribute].forEach(rule => {
          // Skip invalidated attributes
          if (!{}.hasOwnProperty.call(this.errors, attribute)) {
            all.push(this.validateAttribute(attribute, rule))
          }
        })

        return all
      }, [])

    return rulesToResolve
  }

  validateAttribute(attribute, { rule, parameters }) {
    // TODO: Handle file input
    const value = this.data[attribute]
    const method = validators[`validate${rule}`]

    if (method) {
      const passed = method.call(this, attribute, value, parameters)

      if (passed instanceof Promise) {
        passed.then(result => {
          if (!result) {
            this.addError(attribute, rule, parameters)
          }
        })
        .catch(() => {})
      } else if (!passed) {
        this.addError(attribute, rule, parameters)
      }

      return passed
    }
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
    for (const { rule, parameters } of this.rules[attribute]) {
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

function ValidationError(message, errors) {
  this.stack = (new Error()).stack
  this.name = 'ValidationError'
  this.message = message
  this.errors = errors
}

ValidationError.prototype = Error.prototype

export {
  ValidationError
}
