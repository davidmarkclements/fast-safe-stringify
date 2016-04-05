function circular(self, obj, stack) {
  var pos = stack.indexOf(self)
  if (++pos) stack.length = pos
  else stack.push(self)
  if (~stack.indexOf(obj)) return true
  if (Object(obj) === obj) stack.push(obj)
  return false
}

function r(k, v) {
  return circular(this, v, r.stack) ? '[Circular]' : v
}

function stringify(arg) {
  r.stack = []
  return JSON.stringify(arg, r)
}

module.exports = stringify
