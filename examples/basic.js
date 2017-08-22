const {validate} = require('../src')

export default () => {
  const data = {
    firstName: '',
    lastName: 'Doe',
    age: [16, 24],
    gender: 'male'
  }

  const rules = {
    firstName: 'required|min:2',
    lastName: 'required|min:2',
    'age.*': 'required|numeric|min:18'
  }

  const messages = {
    required: 'field is required',
    'firstName.required': 'First name is required',
    'age.*': {
      min: 'Every age must be at least :min'
    }
  }

  validate(data, rules, messages).then(console.log).catch(console.log)
}
