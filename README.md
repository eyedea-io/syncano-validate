[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)   [![CircleCI](https://circleci.com/gh/eyedea-io/syncano-server-js-validator/tree/master.svg?style=shield)](https://circleci.com/gh/eyedea-io/syncano-server-js-validator/tree/master)
[![codecov](https://codecov.io/gh/eyedea-io/syncano-server-js-validator/branch/master/graph/badge.svg)](https://codecov.io/gh/eyedea-io/syncano-server-js-validator)

# syncano-server-js-validator

## TODO:

* Accepted
* After (Date)
* Alpha
* Alpha Dash
* Alpha Numeric
* Before (Date)
* Between
* Confirmed
* Date
* Date Format
* Different
* Digits Between
* Dimensions (Image Files)
* E-Mail
* File
* Filled
* Image (File)
* In Array
* Integer
* IP Address
* JSON
* MIME Types
* MIME Type By File Extension
* Nullable
* Not In
* Present
* Regular Expression
* Same
* Size
* String
* Timezone
* Unique (Database)

## Usage

### Basic

```js
import Validator from 'syncano-server-js-validator'
import syncano from 'syncano'

// Initialize syncano connection
// It's needed for rules like: unique, exists... that depends on syncano
const connection = syncano({
  apiKey: '<SYNCANO_API_KEY>'
}).setInstanceName('<SYNCANO_INSTANCE_NAME')

const validator = new Validator(connection)

const data = {
  firstName: {
    value: 'John',
    validate: 'required|min:2'
  }
  lastName: {
    value: 'Doe',
    validate: 'required|min:2'
  },
  username: {
    value: 'john.doe'
    validate: 'required|unique:users,username'
  }
  email: {
    value: 'john.doe@example.com',
    validate: 'required|email'
  }
  age: {
    value: 43,
    validate: 'required|numeric|min:18'
  },
  gender: {
    value: 'male',
    validate: 'in:male,female'
  }
}

validator.validate(data)
  .then(() => {
    // All params valid! Continue code...
  })
  .catch(errors => {
    // Handle response
  })
```
