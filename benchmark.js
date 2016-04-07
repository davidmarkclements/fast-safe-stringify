var bench = require('fastbench')
var inspect = require('util').inspect
var jsonStringifySafe = require('json-stringify-safe')
var fastSafeStringify = require('./')
var obj = {foo: 1}
obj.o = {obj: obj}
var deep = require('./package.json')
deep.deep = Object.assign({}, deep)
deep.deep.deep = Object.assign({}, deep.deep)
deep.deep.deep.deep = Object.assign({}, deep.deep.deep)

var run = bench([
  function inspectBench (cb) {
    inspect(obj)
    setImmediate(cb)
  },
  function jsonStringifySafeBench (cb) {
    jsonStringifySafe(obj)
    setImmediate(cb)
  },
  function fastSafeStringifyBench (cb) {
    fastSafeStringify(obj)
    setImmediate(cb)
  },
  function inspectDeepBench (cb) {
    inspect(deep)
    setImmediate(cb)
  },
  function jsonStringifySafeDeepBench (cb) {
    jsonStringifySafe(deep)
    setImmediate(cb)
  },
  function fastSafeStringifyDeepBench (cb) {
    fastSafeStringify(deep)
    setImmediate(cb)
  }
], 10000)

run(run)
