function safe() {
  var stack = []
  return tryStringify
  
  function r(k, v) {
    if (circular(v, stack)) return '[Circular]'
    return v
  }

  function tryStringify(arg) {
    return JSON.stringify(arg, r)
  }
}

function circular(obj, stack) {
  if (~stack.indexOf(obj)) { return true }
  stack.push(obj)
  return false
}

module.exports = safe