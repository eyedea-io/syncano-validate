/* eslint-disable camelcase */
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
  boolean: 'The :attribute field must be true or false.',
  url: 'The :attribute format is invalid.',
  digits: 'The :attribute must be :digits digits.',
  digits_between: 'The :attribute must be between :min and :max digits.',
  integer: 'The :attribute must be an integer.',
  numeric: 'The :attribute must be numeric.',
  accepted: 'The :attribute must be accepted.',
  alpha: 'The :attribute may only contain letters.',
  alpha_num: 'The :attribute may only contain letters and numbers.',
  regex: 'The :attribute format is invalid.',
  date: 'The :attribute is not a valid date.',
  email: 'The :attribute must be a valid email address.'
}
