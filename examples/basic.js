const { validate } = require('../src')

export default () => {
  const data = {
    firstName: 'A',
    lastName: 'Doe',
    age: 16,
    gender: 'male'
  }

  const rules = {
    firstName: 'required|min:2',
    lastName: 'required|min:2',
    age: 'required|min:18',
    gender: 'in:male,female'
  }

  try {
    validate(data, rules)
  } catch (err) {
    console.log(err.errors)
  }
}
