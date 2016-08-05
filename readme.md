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
If you need `replacer` and `space` parameters as you use them in *SON.stringify*, you can pass them as parameters.
```js
var safeStringify = require('fast-safe-stringify')
safeStringify(obj, replacer, space)
```
By default *replacer* is *null* and *space* is *0* (zero), see the documentation [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

## Benchmarks

The [json-stringify-safe](http://npm.im/json-stringify-safe) module supplies similar functionality with more info and flexibility.

Although not JSON, the core `util.inspect` method can be used for similar purposes (e.g. logging) and also handles circular references.

Here we compare `fast-safe-stringify` with these alternatives:

```js
inspectBench*10000: 132.456ms
jsonStringifySafeBench*10000: 67.382ms
fastSafeStringifyBench*10000: 31.672ms

inspectDeepBench*10000: 1632.687ms
jsonStringifySafeDeepBench*10000: 1062.449ms
fastSafeStringifyDeepBench*10000: 177.926ms
```

`fast-safe-stringify` is 2x faster for small objects,
and 6x faster for large objects than `json-stringify-safe`.

`fast-safe-stringify` is 4x faster for small objects,
and 9x faster for large objects than `util.inspect`.


## Acknowledgements

Sponsored by [nearForm](http://nearform.com)

## License

MIT
