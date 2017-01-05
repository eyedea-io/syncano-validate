const assert = require('assert')
const syncano = require('syncano')
const Validator = require('../src').default

let connection
let validator
let validate

beforeEach(() => {
  connection = syncano({
    apiKey: process.env.SYNCANO_API_KEY
  }).setInstanceName(process.env.SYNCANO_INSTANCE_NAME)

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

  it.skip('passes for valid connection', () => {
    const check = value => assert.ok(value)

    return validator.validateConnection().then(check).catch(check)
  })

  it.skip('throws error for invalid connection', () => {
    const invalidConnection = syncano({
      apiKey: 'invalidApiKey'
    }).setInstanceName('invalidInstanceName')
    const invalidValidator = new Validator(invalidConnection)

    const check = err => assert.equal(err.message, 'No such API Key.')

    return invalidValidator.validateConnection()
      .catch(check)
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
   * MAX
   * ----------------------------------------------------- */
  describe('max', () => {
    it('throws error without parameter', () => {
      const data = { attributeName: { validate: 'max' } }
      const check = err => assert.equal(err.message,
        'Validation rule max requires at least 1 parameters.'
      )

      return validate(data).then(check).catch(check)
    })

    it('throws error when parameter is not a number', () => {
      const data = { attributeName: { validate: 'max:notNumber' } }
      const check = err => assert.equal(err.message,
        'Validation rule max requires number parameter.'
      )

      return validate(data).then(check).catch(check)
    })

    it('throws error for number greater than parameter', () => {
      const data = { attributeName: { validate: 'max:7|numeric', value: 8 } }
      const check = err => assert.equal(err.attributeName,
        'The attribute name may not be greater than 7.'
      )

      return validate(data).then(check).catch(check)
    })

    it('passes for number smaller than parameter', () => {
      const data = { attributeName: { validate: 'max:7|numeric', value: 5 } }
      const check = err => assert.equal(err.attributeName, undefined)

      return validate(data).then(check).catch(check)
    })

    it('passes for number equal to parameter', () => {
      const data = { attributeName: { validate: 'max:7|numeric', value: 7 } }
      const check = err => assert.equal(err.attributeName, undefined)

      return validate(data).then(check).catch(check)
    })

    it('throws error for string longer than parameter', () => {
      const data = { attributeName: { validate: 'max:7', value: 'hello world' } }
      const check = err => assert.equal(err.attributeName,
        'The attribute name may not be greater than 7 characters.'
      )

      return validate(data).then(check).catch(check)
    })

    it('passes for string shorter than parameter', () => {
      const data = { attributeName: { validate: 'max:7', value: 'hello' } }
      const check = err => assert.equal(err.attributeName, undefined)

      return validate(data).then(check).catch(check)
    })

    it('passes for string length equal to parameter', () => {
      const data = { attributeName: { validate: 'max:5', value: 'hello' } }
      const check = err => assert.equal(err.attributeName, undefined)

      return validate(data).then(check).catch(check)
    })

    it('throws error for array length greater than parameter', () => {
      const data = { attributeName: { validate: 'max:3|array', value: ['hello', 'world', 'or', 'nope'] } }
      const check = err => assert.equal(err.attributeName,
        'The attribute name may not have more than 3 items.'
      )

      return validate(data).then(check).catch(check)
    })

    it('passes for array length smaller than parameter', () => {
      const data = { attributeName: { validate: 'max:3|array', value: ['hello', 'world'] } }
      const check = err => assert.equal(err.attributeName, undefined)

      return validate(data).then(check).catch(check)
    })

    it('passes for array length equal to parameter', () => {
      const data = { attributeName: { validate: 'max:2|array', value: ['hello', 'world'] } }
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

    it.skip('throws error for non-existing argument', () => {
      const data = { attributeName: { validate: 'exists:tag,name', value: 'non_existing_tag' } }
      const check = err => assert.equal(err.attributeName,
        'The selected attribute name is invalid.'
      )

      return validate(data).then(check).catch(check)
    })

    it.skip('passes for existing argument', () => {
      const data = { attributeName: { validate: 'exists:tag,name', value: 'existing_tag' } }
      const check = err => assert.equal(err.attributeName, undefined)

      return validate(data).then(check).catch(check)
    })
  })

  describe('#in', () => {
    it('throws error when argument is not in parameters', () => {
      const data = { framework: { validate: 'in:react,vue,angular', value: 'riot' } }
      const check = err => assert.equal(err.framework,
        'The selected framework is invalid.'
      )

      return validate(data).then(check).catch(check)
    })
    it('passes when argument is in parameters', () => {
      const data = { framework: { validate: 'in:react,vue,angular', value: 'vue' } }
      const check = err => assert.equal(err.framework, undefined)

      return validate(data).then(check).catch(check)
    })
  })
})
