const assert = require('assert')
const { validate, ValidationError } = require('../src')

describe('Basics', () => {
  it('finish execution without error', () => {
    assert.doesNotThrow(() => {
      validate({}, {})
    })
  })
})

describe('Rules', () => {
  /*
   * REQUIRED
   * ----------------------------------------------------- */
  describe('required', () => {
    it('throws error for undefined argument', () => {
      assert.throws(() => {
        validate({}, { argument: 'required' })
      }, ValidationError)
    })

    it('throws error for empty argument', () => {
      assert.throws(() => {
        validate({ argument: '' }, { argument: 'required' })
      }, ValidationError)
    })

    it('passes with valid argument', () => {
      assert.doesNotThrow(() => {
        validate({ argument: 'example value' }, { argument: 'required' })
      })
    })
  })

  /*
   * MIN
   * ----------------------------------------------------- */
  describe('min', () => {
    it('throws error without parameter', () => {
      assert.throws(() => {
        validate({}, { argument: 'min' })
      }, ValidationError)
    })
    it('throws error when parameter is invalid', () => {
      assert.throws(() => {
        validate({ argument: 6 }, { argument: 'min:notNumber' })
      }, ValidationError)
    })
    it('throws error for number smaller than parameter', () => {
      assert.throws(() => {
        validate({ argument: 6 }, { argument: 'min:7' })
      }, ValidationError)
    })
    it('passes for number larger than parameter', () => {
      assert.doesNotThrow(() => {
        validate({ argument: 99 }, { argument: 'min:7' })
      }, ValidationError)
    })
    it('passes for number equal to parameter', () => {
      assert.doesNotThrow(() => {
        validate({ argument: 7 }, { argument: 'min:7' })
      }, ValidationError)
    })
    it('throws error for string shorter than parameter', () => {
      assert.throws(() => {
        validate({ argument: 'hello' }, { argument: 'min:10' })
      }, ValidationError)
    })
    it('passes for string longer than parameter', () => {
      assert.doesNotThrow(() => {
        validate({ argument: 'hello' }, { argument: 'min:3' })
      }, ValidationError)
    })
    it('passes for string length equal to parameter', () => {
      assert.doesNotThrow(() => {
        validate({ argument: 'hello' }, { argument: 'min:5' })
      }, ValidationError)
    })
    it('throws error for array length smaller than parameter', () => {
      assert.throws(() => {
        validate({ argument: ['hello', 'world'] }, { argument: 'min:3' })
      }, ValidationError)
    })
    it('passes for array length larger than parameter', () => {
      assert.doesNotThrow(() => {
        validate({ argument: ['hello', 'world'] }, { argument: 'min:1' })
      }, ValidationError)
    })
    it('passes for array length equal to parameter', () => {
      assert.doesNotThrow(() => {
        validate({ argument: ['hello', 'world'] }, { argument: 'min:2' })
      }, ValidationError)
    })
  })
})
