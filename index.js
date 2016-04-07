module.exports = stringify

function stringify (obj) {
  decirc(obj, '', [], null)
  return JSON.stringify(obj)
}
function Circle (val, k, parent) {
  this.val = val
  this.k = k
  this.parent = parent
}
Circle.prototype.toJSON = function toJSON () {
  this.parent[this.k] = this.val
  return '[Circular]'
}
function decirc (val, k, stack, parent) {
  var keys, len, i, pos
  if (typeof val !== 'object' || val === null) { return }
  if (parent) {
    pos = stack.indexOf(parent)
    if (++pos) { stack.length = pos }
    if (~stack.indexOf(val)) {
      parent[k] = new Circle(val, k, parent)
      return
    }
  }
  stack.push(val)
  keys = Object.keys(val)
  len = keys.length
  i = 0
  for (; i < len; i++) {
    k = keys[i]
    decirc(val[k], k, stack, val)
  }
}
