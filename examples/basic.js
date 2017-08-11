const { validate } = require('../src')

export default () => {
  const data = {
    firstName: 'John',
    lastName: 'Doe',
    age: 16,
    gender: 'male'
  }

  const rules = {
    firstName: 'required|min:2',
    lastName: 'required|min:2',
    age: 'required|numeric|min:18',
    gender: 'in:male,female|exists:tag,name'
  }

  validate(data, rules)
    .then(() => console.log())
    .catch(console.log)
}
