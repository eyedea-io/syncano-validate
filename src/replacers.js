export function replaceMin(message, attribute, rule, parameters) {
  return message.replace(':min', parameters[0])
}

export function replaceMax(message, attribute, rule, parameters) {
  return message.replace(':max', parameters[0])
}
