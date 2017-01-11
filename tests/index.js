const chai = require('chai')
const syncano = require('syncano')
const Validator = require('../src').default

const { assert } = chai

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

  /*
   * BOOLEAN
   * ----------------------------------------------------- */
  describe('boolean', () => {
    it('throws error when argument is not true or false', () => {
      const data = { tested: { validate: 'boolean', value: '2' } }
      const check = err => assert.equal(err.tested,
        'The tested field must be true or false.'
      )

      return validate(data).then(check).catch(check)
    })
    it('passes when argument is true', () => {
      const data = { tested: { validate: 'boolean', value: true } }
      const check = err => assert.isUndefined(err.tested)

      return validate(data).then(check).catch(check)
    })
    it('passes when argument is 0', () => {
      const data = { tested: { validate: 'boolean', value: 0 } }
      const check = err => assert.isUndefined(err.tested)

      return validate(data).then(check).catch(check)
    })
    it('passes when argument is \'1\'', () => {
      const data = { tested: { validate: 'boolean', value: '1' } }
      const check = err => assert.isUndefined(err.tested)

      return validate(data).then(check).catch(check)
    })
  })

  /*
   * URL
   * ----------------------------------------------------- */
  describe('url', () => {
    it('throws error when url is invalid', () => {
      const data = { url: { validate: 'url', value: 'htt:/google.com' } }
      const check = err => assert.equal(err.url,
       'The url format is invalid.'
     )
      return validate(data).then(check).catch(check)
    })

    it('passes when url is valid', () => {
      const data = { url: { validate: 'url', value: 'https://github.com' } }
      const check = err => assert.equal(err.url, undefined)
      return validate(data).then(check).catch(check)
    })
  })

  /*
   * DIGITS
   * ----------------------------------------------------- */
  describe('#digits', () => {
    it('throws error when an attribute is not given exact number of digits', () => {
      const data = { number: { validate: 'digits:8', value: 123 } }
      const check = err => assert.equal(err.number,
        'The number must be 8 digits.'
      )

      return validate(data).then(check).catch(check)
    })

    it('passes when number is ', () => {
      const data = { number: { validate: 'digits:3', value: 133 } }
      const check = err => assert.equal(err.number, undefined)
      return validate(data).then(check).catch(check)
    })
  })

  /*
   * DIGITS BETWEEN
   * ----------------------------------------------------- */
  describe('#digits_between', () => {
    it('throws error when an attribute is not between min and max', () => {
      const data = { number: { validate: 'digits_between:2,4', value: 3 } }
      const check = err => assert.equal(err.number,
        'The number must be between 2 and 4 digits.'
      )

      return validate(data).then(check).catch(check)
    })

    it('passes when number is between min and max ', () => {
      const data = { number: { validate: 'digits_between:2,4', value: 32 } }
      const check = err => assert.equal(err.number, undefined)
      return validate(data).then(check).catch(check)
    })
  })
  /*
   * INTEGER
   * ----------------------------------------------------- */
  describe('#integer', () => {
    it('throws error when an attribute is not integer', () => {
      const data = { number: { validate: 'integer', value: 8.12 } }
      const check = err => assert.equal(err.number,
        'The number must be an integer.'
      )

      return validate(data).then(check).catch(check)
    })

    it('throws error when an attribute is string and is not integer', () => {
      const data = { number: { validate: 'integer', value: 'test' } }
      const check = err => assert.equal(err.number,
        'The number must be an integer.'
      )

      return validate(data).then(check).catch(check)
    })

    it('throws error when an attribute is array and is not integer', () => {
      const data = { number: { validate: 'integer', value: [1, 2, 3] } }
      const check = err => assert.equal(err.number,
        'The number must be an integer.'
      )

      return validate(data).then(check).catch(check)
    })

    it('throws error when an attribute is null and is not integer', () => {
      const data = { number: { validate: 'integer', value: null } }
      const check = err => assert.equal(err.number,
        'The number must be an integer.'
      )

      return validate(data).then(check).catch(check)
    })

    it('throws error when an attribute is object and is not integer', () => {
      const data = { number: { validate: 'integer', value: {notinteger: 1} } }
      const check = err => assert.equal(err.number,
        'The number must be an integer.'
      )

      return validate(data).then(check).catch(check)
    })

    it('throws error when an attribute is boolean and is not integer', () => {
      const data = { number: { validate: 'integer', value: true } }
      const check = err => assert.equal(err.number,
        'The number must be an integer.'
      )

      return validate(data).then(check).catch(check)
    })

    it('passes when number is integer', () => {
      const data = { number: { validate: 'integer', value: 1 } }
      const check = err => assert.isUndefined(err.number)
      return validate(data).then(check).catch(check)
    })
  })

  /*
   * ACCEPTED
   * ----------------------------------------------------- */
  describe('#accepted', () => {
    it('throws error when an attribute is not given', () => {
      const data = { field: { validate: 'accepted' } }
      const check = err => assert.equal(err.field,
        'The field must be accepted.'
      )

      return validate(data).then(check).catch(check)
    })

    it('throws error when an attribute is not accepted', () => {
      const data = { field: { validate: 'accepted', value: false } }
      const check = err => assert.equal(err.field,
        'The field must be accepted.'
      )

      return validate(data).then(check).catch(check)
    })

    it('passes when field value is true', () => {
      const data = { field: { validate: 'accepted', value: true } }
      const check = err => assert.isUndefined(err.field)

      return validate(data).then(check).catch(check)
    })

    it('passes when field value is \'true\'', () => {
      const data = { field: { validate: 'accepted', value: 'true' } }
      const check = err => assert.isUndefined(err.field)

      return validate(data).then(check).catch(check)
    })

    it('passes when field value is yes', () => {
      const data = { field: { validate: 'accepted', value: 'yes' } }
      const check = err => assert.isUndefined(err.field)

      return validate(data).then(check).catch(check)
    })

    it('passes when field value is on', () => {
      const data = { field: { validate: 'accepted', value: 'on' } }
      const check = err => assert.isUndefined(err.field)

      return validate(data).then(check).catch(check)
    })

    it('passes when field value is 1', () => {
      const data = { field: { validate: 'accepted', value: 1 } }
      const check = err => assert.isUndefined(err.field)

      return validate(data).then(check).catch(check)
    })
  })

  /*
   * DIGITS BETWEEN
   * ----------------------------------------------------- */
  describe('#digits_between', () => {
    it('throws error when an attribute is not between min and max', () => {
      const data = { number: { validate: 'digits_between:2,4', value: 3 } }
      const check = err => assert.equal(err.number,
        'The number must be between 2 and 4 digits.'
      )

      return validate(data).then(check).catch(check)
    })

    it('passes when number is between min and max ', () => {
      const data = { number: { validate: 'digits_between:2,4', value: 32 } }
      const check = err => assert.equal(err.number, undefined)

      return validate(data).then(check).catch(check)
    })
  })
})
