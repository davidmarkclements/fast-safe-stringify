module.exports = stringify
stringify.default = stringify
function stringify (obj) {
  if (obj !== null && typeof obj === 'object' && (typeof obj.toJSON !== 'function' || obj.toJSON.forceDecirc)) {
    decirc(obj, '', [], null)
  }
  return JSON.stringify(obj)
}
function Circle (val, k, parent) {
  this.val = val
  this.k = k
  this.parent = parent
  this.count = 1
}
Circle.prototype.toJSON = function toJSON () {
  if (--this.count === 0) {
    this.parent[this.k] = this.val
  }
  return '[Circular]'
}
function decirc (val, k, stack, parent) {
  var keys, len, i, j, exists, stackLen
  if (typeof val !== 'object' || val === null) {
    // not an object, nothing to do
    return
  } else if (val instanceof Circle) {
    val.count++
    return
  } else if (typeof val.toJSON === 'function' && !val.toJSON.forceDecirc) {
    return
  } else if (parent) {
    j = 0
    exists = false
    stackLen = stack.length
    for (; j < stackLen; j++) {
      if (stack[j] === val) {
        exists = true
        break
      }
    }
    if (exists) {
      parent[k] = new Circle(val, k, parent)
      return
    }
  }
  stack.push(val)
  keys = []
  for (var key in val) {
    if (Object.prototype.hasOwnProperty.call(val, key)) keys.push(key)
  }
  len = keys.length
  i = 0
  for (; i < len; i++) {
    k = keys[i]
    decirc(val[k], k, stack, val)
  }
  stack.pop()
}
