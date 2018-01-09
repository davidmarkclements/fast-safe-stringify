module.exports = stringify
stringify.default = stringify
function stringify (obj) {
  if (typeof obj === 'object') {
    if (obj === null) {
      return 'null'
    }
    if (typeof obj.toJSON !== 'function') {
      decirc(obj, '', [], null)
    }
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
  var keys, key, i
  if (typeof val !== 'object' || val === null) {
    // not an object, nothing to do
    return
  } else if (val instanceof Circle) {
    val.count++
    return
  } else if (typeof val.toJSON === 'function' && !val.toJSON.forceDecirc) {
    return
  } else if (parent) {
    for (i = 0; i < stack.length; i++) {
      if (stack[i] === val) {
        parent[k] = new Circle(val, k, parent)
        return
      }
    }
  }
  stack.push(val)
  keys = []
  for (key in val) {
    if (Object.prototype.hasOwnProperty.call(val, key)) keys.push(key)
  }
  for (i = 0; i < keys.length; i++) {
    key = keys[i]
    decirc(val[key], key, stack, val)
  }
  stack.pop()
}
