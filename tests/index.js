const assert = require('assert')
const syncano = require('syncano')
const Validator = require('../src').default
const { apiKey, instanceName } = require('./config.json')

let connection
let validator
let validate

beforeEach(() => {
  connection = syncano({
    apiKey
  }).setInstanceName(instanceName)

  validator = new Validator(connection)
  validate = validator.validate.bind(validator)
})

describe('validate function', () => {
  it('finish execution without error', () => {
    assert.doesNotThrow(() => {
      validate({})
    })
  })

  it('throws error for invalid rule', () => {
    const data = { attributeName: { validate: 'invalid_rule' } }
    const check = err => assert.equal(err.message,
      'Invalid validation rule invalid_rule'
    )

    return validate(data).catch(check)
  })
})

describe('rule', () => {
  /*
   * REQUIRED
   * ----------------------------------------------------- */
  describe('#required', () => {
    it('throws error for undefined argument value', () => {
      const data = { attributeName: { validate: 'required' } }
      const check = err => assert.equal(err.attributeName,
        'The attribute name field is required.'
      )

      return validate(data).then(check).catch(check)
    })

    it('throws error for empty argument', () => {
      const data = { attributeName: { validate: 'required', value: '' } }
      const check = err => assert.equal(err.attributeName,
        'The attribute name field is required.'
      )

      return validate(data).then(check).catch(check)
    })

    it('passes with valid argument', () => {
      const data = { attributeName: { validate: 'required', value: 'example' } }
      const check = err => assert.equal(err.attributeName, undefined)

      return validate(data).then(check).catch(check)
    })
  })

  /*
   * MIN
   * ----------------------------------------------------- */
  describe('min', () => {
    it('throws error without parameter', () => {
      const data = { attributeName: { validate: 'min' } }
      const check = err => assert.equal(err.message,
        'Validation rule min requires at least 1 parameters.'
      )

      return validate(data).then(check).catch(check)
    })

    it('throws error when parameter is not a number', () => {
      const data = { attributeName: { validate: 'min:notNumber' } }
      const check = err => assert.equal(err.message,
        'Validation rule min requires number parameter.'
      )

      return validate(data).then(check).catch(check)
    })

    it('throws error for number smaller than parameter', () => {
      const data = { attributeName: { validate: 'min:7|numeric', value: 6 } }
      const check = err => assert.equal(err.attributeName,
        'The attribute name must be at least 7.'
      )

      return validate(data).then(check).catch(check)
    })

    it('passes for number larger than parameter', () => {
      const data = { attributeName: { validate: 'min:7|numeric', value: 100 } }
      const check = err => assert.equal(err.attributeName, undefined)

      return validate(data).then(check).catch(check)
    })

    it('passes for number equal to parameter', () => {
      const data = { attributeName: { validate: 'min:7|numeric', value: 7 } }
      const check = err => assert.equal(err.attributeName, undefined)

      return validate(data).then(check).catch(check)
    })

    it('throws error for string shorter than parameter', () => {
      const data = { attributeName: { validate: 'min:7', value: 'hello' } }
      const check = err => assert.equal(err.attributeName,
        'The attribute name must be at least 7 characters.'
      )

      return validate(data).then(check).catch(check)
    })

    it('passes for string longer than parameter', () => {
      const data = { attributeName: { validate: 'min:3', value: 'hello' } }
      const check = err => assert.equal(err.attributeName, undefined)

      return validate(data).then(check).catch(check)
    })

    it('passes for string length equal to parameter', () => {
      const data = { attributeName: { validate: 'min:5', value: 'hello' } }
      const check = err => assert.equal(err.attributeName, undefined)

      return validate(data).then(check).catch(check)
    })

    it('throws error for array length smaller than parameter', () => {
      const data = { attributeName: { validate: 'min:3|array', value: ['hello', 'world'] } }
      const check = err => assert.equal(err.attributeName,
        'The attribute name must have at least 3 items.'
      )

      return validate(data).then(check).catch(check)
    })

    it('passes for array length larger than parameter', () => {
      const data = { attributeName: { validate: 'min:1|array', value: ['hello', 'world'] } }
      const check = err => assert.equal(err.attributeName, undefined)

      return validate(data).then(check).catch(check)
    })

    it('passes for array length equal to parameter', () => {
      const data = { attributeName: { validate: 'min:2|array', value: ['hello', 'world'] } }
      const check = err => assert.equal(err.attributeName, undefined)

      return validate(data).then(check).catch(check)
    })
  })

  /*
   * EXISTS
   * ----------------------------------------------------- */
  describe('exists', () => {
    it('throws error when passed 1 parameter', () => {
      const data = { attributeName: { validate: 'exists:tag', value: 'news' } }
      const check = err => assert.equal(err.message,
        'Validation rule exists requires at least 2 parameters.'
      )

      return validate(data).then(check).catch(check)
    })

    it('throws error for non-existing argument', () => {
      const data = { attributeName: { validate: 'exists:tag,name', value: 'non_existing_tag' } }
      const check = err => assert.equal(err.attributeName,
        'The selected attribute name is invalid.'
      )

      return validate(data).then(check).catch(check)
    })

    it('passes for existing argument', () => {
      const data = { attributeName: { validate: 'exists:tag,name', value: 'existing_tag' } }
      const check = err => assert.equal(err.attributeName, undefined)

      return validate(data).then(check).catch(check)
    })
  })
})
