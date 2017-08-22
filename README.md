# Syncano Validator

> Client/Server side validation library based on Laravel.

[![XO code style][xo-badge]][xo]
[![CircleCI][circleci-badge]][circleci]
[![codecov][codecov-badge]][codecov]

[xo]: https://github.com/sindresorhus/xo
[xo-badge]: https://img.shields.io/badge/code_style-XO-5ed9c7.svg
[circleci]: https://circleci.com/gh/eyedea-io/syncano-validate/tree/devel
[circleci-badge]: https://circleci.com/gh/eyedea-io/syncano-validate.svg?style=shield&circle-token=4f0733cbf425699a9ca0bc95d44ade178e5a7abd
[codecov]: https://codecov.io/gh/eyedea-io/syncano-validate
[codecov-badge]: https://codecov.io/gh/eyedea-io/syncano-validate/branch/devel/graph/badge.svg

```
$ npm install syncano-validate
```

## How to use

```js
import {validate} from 'syncano-validate'

const data = {
  firstName: 'John',
  lastName: 'Doe',
  username: 'john.doe'
  email: 'john.doe@example.com',
  age: 43,
  gender: 'male',
  phoneNumber: '555-444-333'
}

const rules = {
  firstName: 'required|min:2',
  lastName: 'required|min:2',
  username: 'required|unique:users,username',
  email: 'required|email',
  age: 'required|numeric|min:18',
  gender: 'in:male,female',
  phoneNumber: 'regex:[0-9]{3}?-?[0-9]{3}?-?[0-9]{3}'
}

validate(data, rules)
  .then(() => {
    // All params valid! Continue code...
  })
  .catch(errors => {
    // Handle errors
  })
```

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
* Same
* Size
* String
* Timezone
* Unique (Database)
