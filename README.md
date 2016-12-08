[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)   [![CircleCI](https://circleci.com/gh/eyedea-io/syncano-server-js-validator/tree/master.svg?style=shield)](https://circleci.com/gh/eyedea-io/syncano-server-js-validator/tree/master)

# syncano-server-js-validator

## Usage

### Basic

```js
import { validate } from 'syncano-server-js-validator'

const data = {
  firstName: 'John',
  lastName: 'Doe',
  age: 43,
  gender: 'male'
}

const rules = {
  firstName: 'required|min:2',
  lastName: 'required|min:2',
  age: 'required|min:18',
  gender: 'in:male,female'
}

validate(data, rules)

// ... countinue code
``` 
