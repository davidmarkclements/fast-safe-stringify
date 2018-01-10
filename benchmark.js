var bench = require('fastbench')
var inspect = require('util').inspect
var jsonStringifySafe = require('json-stringify-safe')
var fastSafeStringify = require('./')
var array = new Array(10).fill(0).map((_, i) => i)
var obj = {foo: array}
var circ = JSON.parse(JSON.stringify(obj))
circ.o = {obj: circ, array}
var deep = require('./package.json')
deep.deep = JSON.parse(JSON.stringify(deep))
deep.deep.deep = JSON.parse(JSON.stringify(deep))
deep.deep.deep.deep = JSON.parse(JSON.stringify(deep))
deep.array = array

var deepCirc = JSON.parse(JSON.stringify(deep))
deepCirc.deep.deep.deep.circ = deepCirc
deepCirc.deep.deep.circ = deepCirc
deepCirc.deep.circ = deepCirc
deepCirc.array = array

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
  function inspectCircBench (cb) {
    inspect(circ)
    setImmediate(cb)
  },
  function jsonStringifyCircSafeBench (cb) {
    jsonStringifySafe(circ)
    setImmediate(cb)
  },
  function fastSafeStringifyCircBench (cb) {
    fastSafeStringify(circ)
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
  },
  function inspectDeepCircBench (cb) {
    inspect(deepCirc)
    setImmediate(cb)
  },
  function jsonStringifySafeDeepCircBench (cb) {
    jsonStringifySafe(deepCirc)
    setImmediate(cb)
  },
  function fastSafeStringifyDeepCircBench (cb) {
    fastSafeStringify(deepCirc)
    setImmediate(cb)
  }
], 10000)

run(run)
