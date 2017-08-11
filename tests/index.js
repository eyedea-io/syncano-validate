const chai = require('chai')
const { default: syncano } = require('syncano-server')
const { default: validator } = require('../src')

const { assert } = chai
const { validate } = validator

describe('validate function', () => {
  it('finish execution without error', () => {
    assert.doesNotThrow(() => validate())
  })

  it('throws error for invalid rule', () => {
    const data = {}
    const rules = { attributeName: 'invalid_rule' }
    const check = err => assert.equal(err.message,
      'Invalid validation rule invalid_rule'
    )

    return validate(data, rules).catch(check)
  })

  it.skip('passes for valid connection', () => {
    const check = value => assert.ok(value)

    return validator.validateConnection().then(check).catch(check)
  })

  it.skip('throws error for invalid connection', () => {
    const invalidValidator = validator.connection(syncano)

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
      const data = {}
      const rules = { attributeName: 'required' }
      const check = err => assert.equal(err.attributeName,
        'The attribute name field is required.'
      )

      return validate(data, rules).then(check).catch(check)
    })

    it('throws error for empty argument', () => {
      const data = { attributeName: '' }
      const rules = { attributeName: 'required' }
      const check = err => assert.equal(err.attributeName,
        'The attribute name field is required.'
      )

      return validate(data, rules).then(check).catch(check)
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
      const data = {}
      const rules = { attributeName: 'min' }
      const check = err => assert.equal(err.message,
        'Validation rule min requires at least 1 parameters.'
      )

      return validate(data, rules).then(check).catch(check)
    })

    it('throws error when parameter is not a number', () => {
      const data = {}
      const rules = { attributeName: 'min:notNumber' }
      const check = err => assert.equal(err.message,
        'Validation rule min requires number parameter.'
      )

      return validate(data, rules).then(check).catch(check)
    })

    it('throws error for number smaller than parameter', () => {
      const data = { attributeName: 5 }
      const rules = { attributeName: 'min:7|numeric' }
      const check = err => assert.equal(err.attributeName,
        'The attribute name must be at least 7.'
      )

      return validate(data, rules).then(check).catch(check)
    })

    it('passes for number larger than parameter', () => {
      const data = { attributeName: 100 }
      const rules = { attributeName: 'min:7|numeric' }
      const check = err => assert.equal(err.attributeName, undefined)

      return validate(data, rules).then(check).catch(check)
    })

    it('passes for number equal to parameter', () => {
      const data = { attributeName: 7 }
      const rules = { attributeName: 'min:7|numeric' }
      const check = err => assert.equal(err.attributeName, undefined)

      return validate(data, rules).then(check).catch(check)
    })

    it('throws error for string shorter than parameter', () => {
      const data = { attributeName: 'hello' }
      const rules = { attributeName: 'min:7' }
      const check = err => assert.equal(err.attributeName,
        'The attribute name must be at least 7 characters.'
      )

      return validate(data, rules).then(check).catch(check)
    })

    it('passes for string longer than parameter', () => {
      const data = { attributeName: 'hello' }
      const rules = { attributeName: 'min:3' }
      const check = err => assert.equal(err.attributeName, undefined)

      return validate(data, rules).then(check).catch(check)
    })

    it('passes for string length equal to parameter', () => {
      const data = { attributeName: 'hello' }
      const rules = { attributeName: 'min:5' }
      const check = err => assert.equal(err.attributeName, undefined)

      return validate(data, rules).then(check).catch(check)
    })

    it('throws error for array length smaller than parameter', () => {
      const data = { attributeName: ['hello', 'world'] }
      const rules = { attributeName: 'min:3|array' }
      const check = err => assert.equal(err.attributeName,
        'The attribute name must have at least 3 items.'
      )

      return validate(data, rules).then(check).catch(check)
    })

    it('passes for array length larger than parameter', () => {
      const data = { attributeName: ['hello', 'world'] }
      const rules = { attributeName: 'min:1|array' }
      const check = err => assert.equal(err.attributeName, undefined)

      return validate(data, rules).then(check).catch(check)
    })

    it('passes for array length equal to parameter', () => {
      const data = { attributeName: ['hello', 'world'] }
      const rules = { attributeName: 'min:2|array' }
      const check = err => assert.equal(err.attributeName, undefined)

      return validate(data, rules).then(check).catch(check)
    })
  })

  /*
   * MAX
   * ----------------------------------------------------- */
  describe('max', () => {
    it('throws error without parameter', () => {
      const data = {}
      const rules = { attributeName: 'max' }
      const check = err => assert.equal(err.message,
        'Validation rule max requires at least 1 parameters.'
      )

      return validate(data, rules).then(check).catch(check)
    })

    it('throws error when parameter is not a number', () => {
      const data = {}
      const rules = { attributeName: 'max:notNumber' }
      const check = err => assert.equal(err.message,
        'Validation rule max requires number parameter.'
      )

      return validate(data, rules).then(check).catch(check)
    })

    it('throws error for number greater than parameter', () => {
      const data = { attributeName: 8 }
      const rules = { attributeName: 'max:7|numeric' }
      const check = err => assert.equal(err.attributeName,
        'The attribute name may not be greater than 7.'
      )

      return validate(data, rules).then(check).catch(check)
    })

    it('passes for number smaller than parameter', () => {
      const data = { attributeName: 5 }
      const rules = { attributeName: 'max:7|numeric' }
      const check = err => assert.equal(err.attributeName, undefined)

      return validate(data, rules).then(check).catch(check)
    })

    it('passes for number equal to parameter', () => {
      const data = { attributeName: 7 }
      const rules = { attributeName: 'max:7|numeric' }
      const check = err => assert.equal(err.attributeName, undefined)

      return validate(data, rules).then(check).catch(check)
    })

    it('throws error for string longer than parameter', () => {
      const data = { attributeName: 'hello world' }
      const rules = { attributeName: 'max:7' }
      const check = err => assert.equal(err.attributeName,
        'The attribute name may not be greater than 7 characters.'
      )

      return validate(data, rules).then(check).catch(check)
    })

    it('passes for string shorter than parameter', () => {
      const data = { attributeName: 'hello' }
      const rules = { attributeName: 'max:7' }
      const check = err => assert.equal(err.attributeName, undefined)

      return validate(data, rules).then(check).catch(check)
    })

    it('passes for string length equal to parameter', () => {
      const data = { attributeName: 'hello' }
      const rules = { attributeName: 'max:5' }
      const check = err => assert.equal(err.attributeName, undefined)

      return validate(data, rules).then(check).catch(check)
    })

    it('throws error for array length greater than parameter', () => {
      const data = { attributeName: ['hello', 'world', 'or', 'not'] }
      const rules = { attributeName: 'max:3|array' }
      const check = err => assert.equal(err.attributeName,
        'The attribute name may not have more than 3 items.'
      )

      return validate(data, rules).then(check).catch(check)
    })

    it('passes for array length smaller than parameter', () => {
      const data = { attributeName: ['hello', 'world'] }
      const rules = { attributeName: 'max:3|array' }
      const check = err => assert.equal(err.attributeName, undefined)

      return validate(data, rules).then(check).catch(check)
    })

    it('passes for array length equal to parameter', () => {
      const data = { attributeName: ['hello', 'world'] }
      const rules = { attributeName: 'max:2|array' }
      const check = err => assert.equal(err.attributeName, undefined)

      return validate(data, rules).then(check).catch(check)
    })
  })

  /*
   * EXISTS
   * ----------------------------------------------------- */
  describe('exists', () => {
    // TODO: Mock Syncano environment and requests
    it.skip('throws error when passed 1 parameter', () => {
      const data = { framework: 'news' }
      const rules = { framework: 'exists:tag' }
      const check = err => assert.equal(err.message,
        'Validation rule exists requires at least 2 parameters.'
      )

      return validate(data, rules).then(check).catch(check)
    })

    it.skip('throws error for non-existing argument', () => {
      const data = { framework: 'non_existing_tag' }
      const rules = { framework: 'exists:tag,name' }
      const check = err => assert.equal(err.attributeName,
        'The selected attribute name is invalid.'
      )

      return validate(data, rules).then(check).catch(check)
    })

    it.skip('passes for existing argument', () => {
      const data = { framework: 'existing_tag' }
      const rules = { framework: 'exists:tag,name' }
      const check = err => assert.equal(err.attributeName, undefined)

      return validate(data, rules).then(check).catch(check)
    })
  })

  describe('#in', () => {
    it('throws error when argument is not in parameters', () => {
      const data = { framework: 'riot' }
      const rules = { framework: 'in:react,vue,angular' }
      const check = err => assert.equal(err.framework,
        'The selected framework is invalid.'
      )

      return validate(data, rules).then(check).catch(check)
    })
    it('passes when argument is in parameters', () => {
      const data = { framework: 'vue' }
      const rules = { framework: 'in:react,vue,angular' }
      const check = err => assert.equal(err.framework, undefined)

      return validate(data, rules).then(check).catch(check)
    })
  })

  /*
   * BOOLEAN
   * ----------------------------------------------------- */
  describe('boolean', () => {
    it('throws error when argument is not true or false', () => {
      const data = { tested: '2' }
      const rules = { tested: 'boolean' }
      const check = err => assert.equal(err.tested,
        'The tested field must be true or false.'
      )

      return validate(data, rules).then(check).catch(check)
    })
    it('passes when argument is true', () => {
      const data = { tested: true }
      const rules = { tested: 'boolean' }
      const check = err => assert.isUndefined(err.tested)

      return validate(data, rules).then(check).catch(check)
    })
    it('passes when argument is 0', () => {
      const data = { tested: 0 }
      const rules = { tested: 'boolean' }
      const check = err => assert.isUndefined(err.tested)

      return validate(data, rules).then(check).catch(check)
    })
    it('passes when argument is \'1\'', () => {
      const data = { tested: '1' }
      const rules = { tested: 'boolean' }
      const check = err => assert.isUndefined(err.tested)

      return validate(data, rules).then(check).catch(check)
    })
  })

  /*
   * URL
   * ----------------------------------------------------- */
  describe('url', () => {
    it('throws error when url is invalid', () => {
      const data = { url: 'htt://google.com' }
      const rules = { url: 'url' }
      const check = err => assert.equal(err.url,
        'The url format is invalid.'
      )
      return validate(data, rules).then(check).catch(check)
    })

    it('passes when url is valid', () => {
      const data = { url: 'http://github.com' }
      const rules = { url: 'url' }
      const check = err => assert.equal(err.url, undefined)
      return validate(data, rules).then(check).catch(check)
    })
  })

  /*
   * DIGITS
   * ----------------------------------------------------- */
  describe('#digits', () => {
    it('throws error when an attribute is not given exact number of digits', () => {
      const data = { number: 123 }
      const rules = { number: 'digits:8' }
      const check = err => assert.equal(err.number,
        'The number must be 8 digits.'
      )

      return validate(data, rules).then(check).catch(check)
    })

    it('passes when number is ', () => {
      const data = { number: 123 }
      const rules = { number: 'digits:3' }
      const check = err => assert.equal(err.number, undefined)
      return validate(data, rules).then(check).catch(check)
    })
  })

  /*
   * DIGITS BETWEEN
   * ----------------------------------------------------- */
  describe('#digits_between', () => {
    it('throws error when an attribute is not between min and max', () => {
      const data = { number: 3 }
      const rules = { number: 'digits_between:2,4' }
      const check = err => assert.equal(err.number,
        'The number must be between 2 and 4 digits.'
      )

      return validate(data, rules).then(check).catch(check)
    })

    it('passes when number is between min and max ', () => {
      const data = { number: 32 }
      const rules = { number: 'digits_between:2,4' }
      const check = err => assert.equal(err.number, undefined)
      return validate(data, rules).then(check).catch(check)
    })
  })
  /*
   * INTEGER
   * ----------------------------------------------------- */
  describe('#integer', () => {
    it('throws error when an attribute is not integer', () => {
      const data = { number: 8.12 }
      const rules = { number: 'integer' }
      const check = err => assert.equal(err.number,
        'The number must be an integer.'
      )

      return validate(data, rules).then(check).catch(check)
    })

    it('throws error when an attribute is string and is not integer', () => {
      const data = { number: 'test' }
      const rules = { number: 'integer' }
      const check = err => assert.equal(err.number,
        'The number must be an integer.'
      )

      return validate(data, rules).then(check).catch(check)
    })

    it('throws error when an attribute is array and is not integer', () => {
      const data = { number: [1, 2, 3] }
      const rules = { number: 'integer' }
      const check = err => assert.equal(err.number,
        'The number must be an integer.'
      )

      return validate(data, rules).then(check).catch(check)
    })

    it('throws error when an attribute is null and is not integer', () => {
      const data = { number: null }
      const rules = { number: 'integer' }
      const check = err => assert.equal(err.number,
        'The number must be an integer.'
      )

      return validate(data, rules).then(check).catch(check)
    })

    it('throws error when an attribute is object and is not integer', () => {
      const data = { number: { hello: 1 } }
      const rules = { number: 'integer' }
      const check = err => assert.equal(err.number,
        'The number must be an integer.'
      )

      return validate(data, rules).then(check).catch(check)
    })

    it('throws error when an attribute is boolean and is not integer', () => {
      const data = { number: true }
      const rules = { number: 'integer' }
      const check = err => assert.equal(err.number,
        'The number must be an integer.'
      )

      return validate(data, rules).then(check).catch(check)
    })

    it('passes when number is integer', () => {
      const data = { number: 2 }
      const rules = { number: 'integer' }
      const check = err => assert.isUndefined(err.number)
      return validate(data, rules).then(check).catch(check)
    })
  })

  /*
   * ACCEPTED
   * ----------------------------------------------------- */
  describe('#accepted', () => {
    it('throws error when an attribute is not given', () => {
      const data = {}
      const rules = { field: 'accepted' }
      const check = err => assert.equal(err.field,
        'The field must be accepted.'
      )

      return validate(data, rules).then(check).catch(check)
    })

    it('throws error when an attribute is not accepted', () => {
      const data = { field: false }
      const rules = { field: 'accepted' }
      const check = err => assert.equal(err.field,
        'The field must be accepted.'
      )

      return validate(data, rules).then(check).catch(check)
    })

    it('passes when field value is true', () => {
      const data = { field: true }
      const rules = { field: 'accepted' }
      const check = err => assert.isUndefined(err.field)

      return validate(data, rules).then(check).catch(check)
    })

    it('passes when field value is \'true\'', () => {
      const data = { field: 'true' }
      const rules = { field: 'accepted' }
      const check = err => assert.isUndefined(err.field)

      return validate(data, rules).then(check).catch(check)
    })

    it('passes when field value is yes', () => {
      const data = { field: 'yes' }
      const rules = { field: 'accepted' }
      const check = err => assert.isUndefined(err.field)

      return validate(data, rules).then(check).catch(check)
    })

    it('passes when field value is on', () => {
      const data = { field: 'on' }
      const rules = { field: 'accepted' }
      const check = err => assert.isUndefined(err.field)

      return validate(data, rules).then(check).catch(check)
    })

    it('passes when field value is 1', () => {
      const data = { field: 1 }
      const rules = { field: 'accepted' }
      const check = err => assert.isUndefined(err.field)

      return validate(data, rules).then(check).catch(check)
    })
  })

  /*
   * DIGITS BETWEEN
   * ----------------------------------------------------- */
  describe('#digits_between', () => {
    it('throws error when an attribute is not between min and max', () => {
      const data = { number: 3 }
      const rules = { number: 'digits_between:2,4' }
      const check = err => assert.equal(err.number,
        'The number must be between 2 and 4 digits.'
      )

      return validate(data, rules).then(check).catch(check)
    })

    it('passes when number is between min and max ', () => {
      const data = { number: 32 }
      const rules = { number: 'digits_between:2,4' }
      const check = err => assert.equal(err.number, undefined)

      return validate(data, rules).then(check).catch(check)
    })
  })

  /*
   * ALPHA
   * ----------------------------------------------------- */
  describe('#alpha', () => {
    it('throws error when an attribute does not contains only letters', () => {
      const data = { text: 'test123' }
      const rules = { text: 'alpha' }
      const check = err => assert.equal(err.text,
        'The text may only contain letters.'
      )

      return validate(data, rules).then(check).catch(check)
    })

    it('throws error when an attribute is not a string', () => {
      const data = { text: 123 }
      const rules = { text: 'alpha' }
      const check = err => assert.equal(err.text,
        'The text may only contain letters.'
      )

      return validate(data, rules).then(check).catch(check)
    })

    it('throws error when an attribute has space in text', () => {
      const data = { text: 'test test' }
      const rules = { text: 'alpha' }
      const check = err => assert.equal(err.text,
        'The text may only contain letters.'
      )

      return validate(data, rules).then(check).catch(check)
    })

    it('passes when attribute contains only letters ', () => {
      const data = { text: 'tEsT' }
      const rules = { text: 'alpha' }
      const check = err => assert.isUndefined(err.text)

      return validate(data, rules).then(check).catch(check)
    })
  })

  /*
   * ALPHA NUMERIC
   * ----------------------------------------------------- */
  describe('#alpha_num', () => {
    it('throws error when an attribute does not contains only letters or numbers', () => {
      const data = { text: 'test-123' }
      const rules = { text: 'alpha_num' }
      const check = err => assert.equal(err.text,
        'The text may only contain letters and numbers.'
      )

      return validate(data, rules).then(check).catch(check)
    })

    it('throws error when an attribute is not a string', () => {
      const data = { text: true }
      const rules = { text: 'alpha_num' }
      const check = err => assert.equal(err.text,
        'The text may only contain letters and numbers.'
      )

      return validate(data, rules).then(check).catch(check)
    })

    it('throws error when an attribute has space in text', () => {
      const data = { text: 'test 123' }
      const rules = { text: 'alpha_num' }
      const check = err => assert.equal(err.text,
        'The text may only contain letters and numbers.'
      )

      return validate(data, rules).then(check).catch(check)
    })

    it('passes when attribute contains only letters ', () => {
      const data = { text: 'tEsT' }
      const rules = { text: 'alpha_num' }
      const check = err => assert.isUndefined(err.text)

      return validate(data, rules).then(check).catch(check)
    })

    it('passes when attribute contains only numbers as a string', () => {
      const data = { text: '123' }
      const rules = { text: 'alpha_num' }
      const check = err => assert.isUndefined(err.text)

      return validate(data, rules).then(check).catch(check)
    })

    it('passes when attribute contains only numbers ', () => {
      const data = { text: 123 }
      const rules = { text: 'alpha_num' }
      const check = err => assert.isUndefined(err.text)

      return validate(data, rules).then(check).catch(check)
    })

    it('passes when attribute contains letters and numbers ', () => {
      const data = { text: 'test123' }
      const rules = { text: 'alpha_num' }
      const check = err => assert.isUndefined(err.text)

      return validate(data, rules).then(check).catch(check)
    })
  })
})
