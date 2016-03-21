# fast-stringify-safe

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

The [json-stringify-safe](http://npm.im) module supplies similar 
functionality with slightly more info. Although not JSON,
the core `util.inspect` method can be used for similar purposes (e.g. 
logging) and also handles circular references.

Here we compare fast-safe-stringify with these alternatives:

```js
inspectBench*10000: 163.506ms
jsonStringifySafeBench*10000: 71.508ms
fastSafeStringifyBench*10000: 35.447ms
inspectBench*10000: 135.528ms
jsonStringifySafeBench*10000: 64.065ms
fastSafeStringifyBench*10000: 33.956ms
```

`fast-stringify-safe` is 2x faster than `json-stringify-safe` and 4x
faster than `util.inspect`.

## Acknowledgements

Sponsored by [nearForm](http://nearform.com)

## License

MIT

