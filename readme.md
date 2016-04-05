# fast-safe-stringify

Safely and quickly serialize JavaScript objects

Detects circular dependencies instead of throwing
(as per usual `JSON.stringify` usage)

## Usage

```js
var safeStringify = require('fast-safe-stringify')
var o = {a: 1}
o.o = o

console.log(safeStringify(o))
console.log(JSON.stringify(o)) //<-- throws
```

## Benchmarks

The [json-stringify-safe](http://npm.im/json-stringify-safe) module supplies similar functionality with more info and flexibility. 

Although not JSON, the core `util.inspect` method can be used for similar purposes (e.g. logging) and also handles circular references.

Here we compare `fast-safe-stringify` with these alternatives:

```js
inspectBench*10000: 155.304ms
jsonStringifySafeBench*10000: 86.004ms
fastSafeStringifyBench*10000: 39.039ms
inspectBench*10000: 133.499ms
jsonStringifySafeBench*10000: 74.028ms
fastSafeStringifyBench*10000: 38.698ms
```

`fast-safe-stringify` is 2x faster than `json-stringify-safe` and 3x-4x
faster than `util.inspect`.

## Acknowledgements

Sponsored by [nearForm](http://nearform.com)

## License

MIT

