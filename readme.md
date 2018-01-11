# fast-safe-stringify

Safe and fast serialization alternative to [JSON.stringify][].

Gracefully handles circular structures instead of throwing.

Provides a deterministic ("stable") version as well that will also gracefully
handle circular structures. See the example below for further information.

## Usage

The same as [JSON.stringify][].

`stringify(value[, replacer[, space]])`

```js
const safeStringify = require('fast-safe-stringify')
const o = { a: 1 }
o.o = o

console.log(safeStringify(o))
// '{"a":1,"o":"[Circular]"}'
console.log(JSON.stringify(o))
// TypeError: Converting circular structure to JSON

function replacer(key, value) {
  console.log('Key:', JSON.stringify(key), 'Value:', JSON.stringify(value))
  // Remove the circular structure
  if (value === '[Circular]') {
    return
  }
  return value
}
const serialized = safeStringify(o, replacer, 2)
// Key: "" Value: {"a":1,"o":"[Circular]"}
// Key: "a" Value: 1
// Key: "o" Value: "[Circular]"
console.log(serialized)
// {
//  "a": 1
// }
```

Using the deterministic version also works the same:

```js
const safeStringify = require('fast-safe-stringify')
const o = { b: 1, a: 0 }
o.o = o

console.log(safeStringify(o))
// '{"b":1,"a":0,"o":"[Circular]"}'
console.log(safeStringify.stableStringify(o))
// '{"a":0,"b":1,"o":"[Circular]"}'
console.log(JSON.stringify(o))
// TypeError: Converting circular structure to JSON
```

## Differences to JSON.stringify

In general the behavior is identical to [JSON.stringify][]. The [`replacer`][]
and [`space`][] options are also available.

A few exceptions exist to [JSON.stringify][] while using [`toJSON`][] or
[`replacer`][]:

### Regular safe stringify

- Manipulating a circular structure of the passed in value in a `toJSON` or the
  `replacer` is not possible! It is possible for any other value and property.

- In case a circular structure is detected and the [`replacer`][] is used it
  will receive the string `[Circular]` as the argument instead of the circular
  object itself.

### Deterministic ("stable") safe stringify

- Manipulating the input object either in a [`toJSON`][] or the [`replacer`][]
  function will not have any effect on the output. The output entirely relies on
  the shape the input value had at the point passed to the stringify function!

- In case a circular structure is detected and the [`replacer`][] is used it
  will receive the string `[Circular]` as the argument instead of the circular
  object itself.

## Benchmarks

Although not JSON, the Node.js `util.inspect` method can be used for similar
purposes (e.g. logging) and also handles circular references.

Here we compare `fast-safe-stringify` with some alternatives:
(Lenovo T450s with a i7-5600U CPU using Node.js 8.9.4)

```md
inspectBench*10000: 57.636ms
jsonStringifySafeBench*10000: 58.737ms
fastSafeStringifyBench*10000: 25.555ms

inspectCircBench*10000: 137.803ms
jsonStringifyCircSafeBench*10000: 110.460ms
fastSafeStringifyCircBench*10000: 38.039ms

inspectDeepBench*10000: 600.103ms
jsonStringifySafeDeepBench*10000: 1345.514ms
fastSafeStringifyDeepBench*10000: 369.198ms

inspectDeepCircBench*10000: 609.102ms
jsonStringifySafeDeepCircBench*10000: 1361.704ms
fastSafeStringifyDeepCircBench*10000: 383.083ms
```

Comparing the deterministic `fast-safe-stringify` with known alternatives:
(Running the `fast-json-stable-stringify` [benchmark][])

```md
fast-json-stable-stringify x 15,494 ops/sec ±1.59% (88 runs sampled)
json-stable-stringify x 12,229 ops/sec ±1.32% (89 runs sampled)
fast-stable-stringify x 16,226 ops/sec ±0.65% (92 runs sampled)
faster-stable-stringify x 13,900 ops/sec ±1.05% (90 runs sampled)
fast-safe-stringify x 26,528 ops/sec ±1.40% (91 runs sampled)

The fastest is fast-safe-stringify
```

## Protip

Whether `fast-safe-stringify` or alternatives are used: if the use case
consists of deeply nested objects without circular references the following
pattern will give best results.
Shallow or one level nested objects on the other hand will slow down with it.
It is entirely dependant on the use case.

```js
const stringify = require('fast-safe-stringify')

function tryJSONStringify (obj) {
  try { return JSON.stringify(obj) } catch (_) {}
}

const serializedString = tryJSONStringify(deep) || stringify(deep)
```

## Acknowledgements

Sponsored by [nearForm](http://nearform.com)

## License

MIT

[`replacer`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#The%20replacer%20parameter
[`space`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#The%20space%20argument
[`toJSON`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#toJSON()_behavior
[benchmark]: https://github.com/epoberezkin/fast-json-stable-stringify/blob/67f688f7441010cfef91a6147280cc501701e83b/benchmark
[JSON.stringify]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
