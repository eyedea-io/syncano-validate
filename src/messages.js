export default {
  required: 'The :attribute field is required.',
  max: {
    numeric: 'The :attribute may not be greater than :max.',
    string: 'The :attribute may not be greater than :max characters.',
    array: 'The :attribute may not have more than :max items.'
  },
  min: {
    numeric: 'The :attribute must be at least :min.',
    string: 'The :attribute must be at least :min characters.',
    array: 'The :attribute must have at least :min items.'
  },
  exists: 'The selected :attribute is invalid.',
  in: 'The selected :attribute is invalid.',
  url: 'The :attribute format is invalid'
}
