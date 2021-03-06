import * as replacers from './replacers'
import * as validators from './validators'
import { is, coerce, snakeCase, studlyCase, isSyncanoServer } from './helpers'
import MESSAGES from './messages'

class Validator {
  constructor(connection) {
    this.connection = connection

    this.numericRules = ['Numeric', 'Integer']
    this.sizeRules = ['Min', 'Max', 'Between']
  }

  setData(data) {
    // TODO: Handle array inputs
    this.data = data
  }

  setRules(rules) {
    // Map attribute to array of rules
    this.rules = Object.keys(rules).reduce((all, attribute) => {
      if (attribute.indexOf('*') >= 0) {
        this.wildcards.push(attribute.split('.')[0])
      }

      return {
        ...all,
        [attribute.split('.')[0]]: this.parseRules(rules[attribute])
      }
    }, {})
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

  validate(data = {}, rules = {}, messages = {}) {
    this.customMessages = messages
    this.wildcards = []

    return new Promise((resolve, reject) => {
      try {
        this.setData(data)
        this.setRules(rules)
      } catch (err) {
        reject(err)
      }

      Promise
        .all(this.attributesPass())
        .then(() => this.passes() ? resolve() : reject(this.errors))
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

  isWildcard(attribute) {
    return this.wildcards.indexOf(attribute.split('.')[0]) >= 0
  }

  validateAttribute(attribute, { rule, parameters }) {
    // TODO: Handle file input
    const method = validators[`validate${rule}`]

    if (method) {
      const value = this.data[attribute]
      let passed

      if (this.isWildcard(attribute)) {
        passed = value
          .map(item => method.call(this, attribute, item, parameters))
      } else {
        passed = method.call(this, attribute, value, parameters)
      }

      if (passed instanceof Promise) {
        passed.then(result => {
          if (!result) {
            this.addError(attribute, rule, parameters)
          }
        })
      } else if (Array.isArray(passed)) {
        passed.forEach((item, i) => {
          if (item === false) {
            this.addError(`${attribute}.${i}`, rule, parameters)
          }
        })
      } else if (!passed) {
        this.addError(attribute, rule, parameters)
      }

      return passed
    }
  }

  addError(attribute, rule, parameters) {
    const [attr, i] = attribute.split('.')
    let message = this.getMessage(attribute, rule)

    message = this.doReplacements(message, attr, rule, parameters)

    if (i) {
      this.errors[attr] = this.errors[attr] || []
      this.errors[attr][i] = message
    } else {
      this.errors[attr] = message
    }
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

    const customMessage = this.getCustomMessage(attribute, rule)

    return customMessage || message
  }

  getCustomMessage(attribute, rule) {
    const lowerRule = snakeCase(rule)

    attribute = this.isWildcard(attribute) ? `${attribute.split('.')[0]}.*` : attribute

    if (
      this.customMessages[attribute] &&
      this.customMessages[attribute][lowerRule]
    ) {
      return this.customMessages[attribute][lowerRule]
    } else if (this.customMessages[`${attribute}.${lowerRule}`]) {
      return this.customMessages[`${attribute}.${lowerRule}`]
    } else if (this.customMessages[lowerRule]) {
      return this.customMessages[lowerRule]
    }
  }

  hasRule(attribute, rules) {
    return this.getRule(attribute, rules) !== undefined
  }

  getRule(attribute, rules) {
    attribute = attribute.split('.')[0]

    for (const { rule, parameters } of this.rules[attribute]) {
      if (rules.indexOf(rule) >= 0) {
        return [rule, parameters]
      }
    }
  }

  doReplacements(message, attribute, rule, parameters) {
    const replacer = replacers[`replace${rule}`]
    const formatedAttribute = snakeCase(attribute).replace('_', '   ')

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

  requireSyncanoEnvironment(rule, attribute) {
    if (!isSyncanoServer()) {
      throw new Error(`Rule "${rule}" of attribute "${attribute}" can be run only in Syncano environment.`)
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

const validator = new Validator()

validator.validate = validator.validate.bind(validator)

const { validate } = validator

export { ValidationError, validate }
export default validator
