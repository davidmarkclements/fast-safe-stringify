'use strict'

module.exports = stringify

var gap = ''
// eslint-disable-next-line
const strEscapeSequencesRegExp = /[\x00-\x1f\x22\x5c]/
// eslint-disable-next-line
const strEscapeSequencesReplacer = /[\x00-\x1f\x22\x5c]/g

// Escaped special characters. Use empty strings to fill up unused entries.
const meta = [
  '\\u0000', '\\u0001', '\\u0002', '\\u0003', '\\u0004',
  '\\u0005', '\\u0006', '\\u0007', '\\b', '\\t',
  '\\n', '\\u000b', '\\f', '\\r', '\\u000e',
  '\\u000f', '\\u0010', '\\u0011', '\\u0012', '\\u0013',
  '\\u0014', '\\u0015', '\\u0016', '\\u0017', '\\u0018',
  '\\u0019', '\\u001a', '\\u001b', '\\u001c', '\\u001d',
  '\\u001e', '\\u001f', '', '', '\\"',
  '', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '\\\\'
]

const escapeFn = (str) => meta[str.charCodeAt(0)]

// Escape control characters, double quotes and the backslash.
function strEscape (str) {
  // Some magic numbers that worked out fine while benchmarking with v8 6.0
  if (str.length < 5000 && !strEscapeSequencesRegExp.test(str)) {
    return `"${str}"`
  }
  if (str.length > 100) {
    return `"${str.replace(strEscapeSequencesReplacer, escapeFn)}"`
  }
  var result = ''
  var last = 0
  for (var i = 0; i < str.length; i++) {
    const point = str.charCodeAt(i)
    if (point === 34 || point === 92 || point < 32) {
      if (last === i) {
        result += meta[point]
      } else {
        result += `${str.slice(last, i)}${meta[point]}`
      }
      last = i + 1
    }
  }
  if (last === 0) {
    result = str
  } else if (last !== i) {
    result += str.slice(last)
  }
  return `"${result}"`
}

// Full version: supports all options
function stringifyFull (key, parent, stack, replacer, indent) {
  var i, res, join
  const mind = gap
  var value = parent[key]

  if (typeof value === 'object' && value !== null && typeof value.toJSON === 'function') {
    value = value.toJSON(key)
  }
  if (typeof replacer === 'function') {
    value = replacer.call(parent, key, value)
  }

  switch (typeof value) {
    case 'object':
      if (value === null) {
        return 'null'
      }
      for (i = 0; i < stack.length; i++) {
        if (stack[i] === value) {
          return '"[Circular]"'
        }
      }
      gap += indent

      if (Array.isArray(value)) {
        if (value.length === 0) {
          return '[]'
        }
        stack.push(value)
        res = '['
        if (gap === '') {
          join = ','
        } else {
          res += '\n'
          join = `,\n${gap}`
        }
        // Use null as a placeholder for non-JSON values.
        for (i = 0; i < value.length - 1; i++) {
          const tmp = stringifyFull(i, value, stack, replacer, indent)
          res += tmp !== undefined ? tmp : 'null'
          res += join
        }
        const tmp = stringifyFull(i, value, stack, replacer, indent)
        res += tmp !== undefined ? tmp : 'null'
        if (gap !== '') {
          res += `\n${mind}`
        }
        res += ']'
        stack.pop()
        gap = mind
        return res
      }

      // If the replacer is an array, use it to select the members to be stringified.
      if (Array.isArray(replacer)) {
        if (replacer.length === 0) {
          return '{}'
        }
        stack.push(value)
        res = '{'
        if (gap === '') {
          join = ','
        } else {
          res += '\n'
          join = `,\n${gap}`
        }
        for (i = 0; i < replacer.length; i++) {
          var last = false
          if (typeof replacer[i] === 'string' || typeof replacer[i] === 'number') {
            key = replacer[i]
            const tmp = stringifyFull(key, value, stack, replacer, indent)
            if (tmp !== undefined) {
              if (last) {
                res += join
              }
              res += `${strEscape(key)}${gap ? ': ' : ':'}${tmp}`
              last = true
            }
          }
        }
      } else {
        // Otherwise, iterate through all of the keys in the object.
        const keys = Object.keys(value).sort(compareFunction)
        if (keys.length === 0) {
          return '{}'
        }
        stack.push(value)
        res = '{'
        if (gap === '') {
          join = ','
        } else {
          res += '\n'
          join = `,\n${gap}`
        }
        for (i = 0; i < keys.length - 1; i++) {
          key = keys[i]
          const tmp = stringifyFull(key, value, stack, replacer, indent)
          if (tmp !== undefined) {
            res += `${strEscape(key)}${gap ? ': ' : ':'}${tmp}`
            res += join
          }
        }
        key = keys[i]
        const tmp = stringifyFull(key, value, stack, replacer, indent)
        if (tmp !== undefined) {
          res += `${strEscape(key)}${gap ? ': ' : ':'}${tmp}`
        }
      }
      if (gap !== '') {
        res += `\n${mind}`
      }
      res += '}'
      stack.pop()
      gap = mind
      return res
    case 'string':
      return strEscape(value)
    case 'number':
      // JSON numbers must be finite. Encode non-finite numbers as null.
      return isFinite(value) ? String(value) : 'null'
    case 'boolean':
      return value === true ? 'true' : 'false'
  }
}

// Supports only the spacer option
function stringifyIndent (key, value, stack, indent) {
  var i, res, join
  const mind = gap

  switch (typeof value) {
    case 'object':
      if (value === null) {
        return 'null'
      }
      if (typeof value.toJSON === 'function') {
        value = value.toJSON(key)
        // Prevent calling `toJSON` again.
        if (typeof value !== 'object') {
          return stringifyIndent(key, value, stack, indent)
        }
        if (value === null) {
          return 'null'
        }
      }
      for (i = 0; i < stack.length; i++) {
        if (stack[i] === value) {
          return '"[Circular]"'
        }
      }
      gap += indent

      if (Array.isArray(value)) {
        if (value.length === 0) {
          return '[]'
        }
        stack.push(value)
        res = '['
        if (gap === '') {
          join = ','
        } else {
          res += '\n'
          join = `,\n${gap}`
        }
        // Use null as a placeholder for non-JSON values.
        for (i = 0; i < value.length - 1; i++) {
          const tmp = stringifyIndent(i, value[i], stack, indent)
          res += tmp !== undefined ? tmp : 'null'
          res += join
        }
        const tmp = stringifyIndent(i, value[i], stack, indent)
        res += tmp !== undefined ? tmp : 'null'
        if (gap !== '') {
          res += `\n${mind}`
        }
        res += ']'
        stack.pop()
        gap = mind
        return res
      }

      const keys = Object.keys(value).sort(compareFunction)
      if (keys.length === 0) {
        return '{}'
      }
      stack.push(value)
      res = '{'
      if (gap === '') {
        join = ','
      } else {
        res += '\n'
        join = `,\n${gap}`
      }
      for (i = 0; i < keys.length - 1; i++) {
        key = keys[i]
        const tmp = stringifyIndent(key, value[key], stack, indent)
        if (tmp !== undefined) {
          res += `${strEscape(key)}${gap ? ': ' : ':'}${tmp}`
          res += join
        }
      }
      key = keys[i]
      const tmp = stringifyIndent(key, value[key], stack, indent)
      if (tmp !== undefined) {
        res += `${strEscape(key)}${gap ? ': ' : ':'}${tmp}`
      }
      if (gap !== '') {
        res += `\n${mind}`
      }
      res += '}'
      stack.pop()
      gap = mind
      return res
    case 'string':
      return strEscape(value)
    case 'number':
      // JSON numbers must be finite. Encode non-finite numbers as null.
      return isFinite(value) ? String(value) : 'null'
    case 'boolean':
      return value === true ? 'true' : 'false'
  }
}

// Supports only the replacer option
function stringifyReplace (key, parent, stack, replacer) {
  var i, res
  var value = parent[key]
  // If the value has a toJSON method, call it to obtain a replacement value.
  if (typeof value === 'object' && value !== null && typeof value.toJSON === 'function') {
    value = value.toJSON(key)
  }
  // If we were called with a replacer function, then call the replacer to
  // obtain a replacement value.
  if (typeof replacer === 'function') {
    value = replacer.call(parent, key, value)
  }

  switch (typeof value) {
    case 'object':
      if (value === null) {
        return 'null'
      }
      for (i = 0; i < stack.length; i++) {
        if (stack[i] === value) {
          return '"[Circular]"'
        }
      }
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return '[]'
        }
        stack.push(value)
        res = '['
        // Use null as a placeholder for non-JSON values.
        for (i = 0; i < value.length - 1; i++) {
          const tmp = stringifySimple(i, value, stack, replacer)
          res += tmp !== undefined ? tmp : 'null'
          res += ','
        }
        const tmp = stringifySimple(i, value, stack, replacer)
        res += tmp !== undefined ? tmp : 'null'
        res += ']'
        stack.pop()
        return res
      }

      // If the replacer is an array, use it to select the members to be stringified.
      if (Array.isArray(replacer)) {
        if (replacer.length === 0) {
          return '{}'
        }
        stack.push(value)
        res = '{'
        for (i = 0; i < replacer.length; i++) {
          var last = false
          if (typeof replacer[i] === 'string' || typeof replacer[i] === 'number') {
            key = replacer[i]
            const tmp = stringifyReplace(key, value, stack, replacer)
            if (tmp !== undefined) {
              if (last) {
                res += ','
              }
              res += `${strEscape(key)}:${tmp}`
              last = true
            }
          }
        }
      } else {
        // Otherwise, iterate through all of the keys in the object.
        const keys = Object.keys(value).sort(compareFunction)
        if (keys.length === 0) {
          return '{}'
        }
        stack.push(value)
        res = '{'
        for (i = 0; i < keys.length - 1; i++) {
          key = keys[i]
          const tmp = stringifyReplace(key, value, stack, replacer)
          if (tmp !== undefined) {
            res += `${strEscape(key)}:${tmp},`
          }
        }
        key = keys[i]
        const tmp = stringifyReplace(key, value, stack, replacer)
        if (tmp !== undefined) {
          res += `${strEscape(key)}:${tmp}`
        }
      }
      res += '}'
      stack.pop()
      return res
    case 'string':
      return strEscape(value)
    case 'number':
      // JSON numbers must be finite. Encode non-finite numbers as null.
      return isFinite(value) ? String(value) : 'null'
    case 'boolean':
      return value === true ? 'true' : 'false'
  }
}

// Simple without any options
function stringifySimple (key, value, stack) {
  var i, res
  switch (typeof value) {
    case 'object':
      if (value === null) {
        return 'null'
      }
      if (typeof value.toJSON === 'function') {
        value = value.toJSON(key)
        // Prevent calling `toJSON` again
        if (typeof value !== 'object') {
          return stringifySimple(key, value, stack)
        }
        if (value === null) {
          return 'null'
        }
      }
      for (i = 0; i < stack.length; i++) {
        if (stack[i] === value) {
          return '"[Circular]"'
        }
      }

      if (Array.isArray(value)) {
        if (value.length === 0) {
          return '[]'
        }
        stack.push(value)
        res = '['
        // Use null as a placeholder for non-JSON values.
        for (i = 0; i < value.length - 1; i++) {
          const tmp = stringifySimple(i, value[i], stack)
          res += tmp !== undefined ? tmp : 'null'
          res += ','
        }
        const tmp = stringifySimple(i, value[i], stack)
        res += tmp !== undefined ? tmp : 'null'
        res += ']'
        stack.pop()
        return res
      }

      const keys = Object.keys(value).sort(compareFunction)
      if (keys.length === 0) {
        return '{}'
      }
      stack.push(value)
      res = '{'
      for (i = 0; i < keys.length - 1; i++) {
        key = keys[i]
        const tmp = stringifySimple(key, value[key], stack)
        if (tmp !== undefined) {
          res += `${strEscape(key)}:${tmp},`
        }
      }
      key = keys[i]
      const tmp = stringifySimple(key, value[key], stack)
      if (tmp !== undefined) {
        res += `${strEscape(key)}:${tmp}`
      }
      res += '}'
      stack.pop()
      return res
    case 'string':
      return strEscape(value)
    case 'number':
      // JSON numbers must be finite. Encode non-finite numbers as null.
      return isFinite(value) ? String(value) : 'null'
    case 'boolean':
      return value === true ? 'true' : 'false'
  }
}

function compareFunction (a, b) {
  if (a < b) {
    return -1
  }
  if (a > b) {
    return 1
  }
  return 0
}

function stringify (value, replacer, spacer) {
  var i
  var indent = ''
  gap = ''

  if (arguments.length > 1) {
    // If the spacer parameter is a number, make an indent string containing that
    // many spaces.
    if (typeof spacer === 'number') {
      for (i = 0; i < spacer; i += 1) {
        indent += ' '
      }
    // If the spacer parameter is a string, it will be used as the indent string.
    } else if (typeof spacer === 'string') {
      indent = spacer
    }
    if (indent !== '') {
      if (replacer) {
        return stringifyFull('', { '': value }, [], replacer, indent)
      }
      return stringifyIndent('', value, [], indent)
    }
    return stringifyReplace('', { '': value }, [], replacer)
  }
  return stringifySimple('', value, [])
}
