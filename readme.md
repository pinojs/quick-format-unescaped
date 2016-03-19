# quick format

Solves a problem with util.format in <= Node 5.9

## usage

```js
var format = require('quick-format')
format(['hello %s %j %d', 'world', {obj: true}, 4, {another: 'obj'}])
```

##  util.format

In `util.format` for Node 5.9, performance is significantly affected
when we pass in more arguments than interpolation characters, e.g

```js
util.format('hello %s %j %d', 'world', {obj: true}, 4, {another: 'obj'})
```

`quick-format` fixes that problem, though this module
will likely become redundant with later releases since this code
was taken (and modified) from Node's master branch.

It also takes an array instead of arguments, which helps us 
avoid the use of `apply` in some cases.

Also - for speed purposes, we ignore symbol.

## Benchmarks

Benchmarks are very marginally slower than 5.9 util.format when
there is no "tail" arguments, 

```
util*50000: 112.749ms
quick*50000: 118.393ms
utilWithTailObj*50000: 517.232ms
quickWithTailObj*50000: 141.821ms
util*50000: 111.217ms
quick*50000: 117.432ms
utilWithTailObj*50000: 504.271ms
quickWithTailObj*50000: 142.759ms
```

## Acknowledgements

Sponsored by nearForm
