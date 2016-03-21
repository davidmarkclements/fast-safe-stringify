function circular(obj, stack) {
  if (~stack.indexOf(obj)) { return true }
  stack.push(obj)
  return false
}

function r(k, v) {
  if (circular(v, r.stack)) return '[Circular]'
  return v
}

function stringify(arg) {
  r.stack = []
  return JSON.stringify(arg, r)
}


module.exports = stringify