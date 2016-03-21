# quick format

Solves a problem with util.format

## usage

```js
var format = require('quick-format')
format(['hello %s %j %d', 'world', {obj: true}, 4, {another: 'obj'}])
```

## caveat!

We use `JSON.stringify` instead of `util.inspect`, this means object
methods *will not be serialized*.

##  util.format

In `util.format` for Node 5.9, performance is significantly affected
when we pass in more arguments than interpolation characters, e.g

```js
util.format('hello %s %j %d', 'world', {obj: true}, 4, {another: 'obj'})
```

This is mostly due to the use of `util.inspect`. Use `JSON.stringify`
(safely) instead which is significantly faster. 

It also takes an array instead of arguments, which helps us 
avoid the use of `apply` in some cases.

Also - for speed purposes, we ignore symbol.

## Benchmarks

Whilst non-tailing case is slightly around a third slower with util.format,
the tailing case is 3x faster.

```
util*100000: 213.905ms
quick*100000: 301.262ms
utilWithTailObj*100000: 999.734ms
quickWithTailObj*100000: 360.216ms
util*100000: 223.177ms
quick*100000: 307.062ms
utilWithTailObj*100000: 998.736ms
quickWithTailObj*100000: 361.509ms
```

## Acknowledgements

Sponsored by nearForm
