[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)   [![CircleCI](https://circleci.com/gh/eyedea-io/syncano-validator/tree/master.svg?style=shield)](https://circleci.com/gh/eyedea-io/syncano-validator/tree/master)
[![codecov](https://codecov.io/gh/eyedea-io/syncano-validator/branch/master/graph/badge.svg)](https://codecov.io/gh/eyedea-io/syncano-validator)

# syncano-validator

## TODO:

* After (Date)
* Alpha Dash
* Before (Date)
* Between
* Confirmed
* Date
* Date Format
* Different
* Dimensions (Image Files)
* E-Mail
* File
* Filled
* Image (File)
* In Array
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

```js
import {validate} from 'syncano-validator'

const data = {
  firstName: 'John',
  lastName: 'Doe',
  username: 'john.doe'
  email: 'john.doe@example.com',
  age: 43,
  gender: 'male'
}

const rules = {
  firstName: 'required|min:2',
  lastName: 'required|min:2',
  username: 'required|unique:users,username',
  email: 'required|email',
  age: 'required|numeric|min:18',
  gender: 'in:male,female'
}

validate(data, rules)
  .then(() => {
    // All params valid! Continue code...
  })
  .catch(errors => {
    // Handle errors
  })
```
