require('babel-register')  // eslint-disable-line import/no-unassigned-import

const basic = require('./basic').default

const examples = { basic }
const args = process.argv.slice(2)
let exampleFound = false

Object.keys(examples).forEach(key => {
  if (args.indexOf(key) >= 0) {
    examples[key]()
    exampleFound = true
  }
})

if (exampleFound === false) {
  console.log(`Example not found. Try one of: ${Object.keys(examples)}`)
}
