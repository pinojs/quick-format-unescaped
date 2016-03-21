var bench = require('fastbench')
var utilFormat = require('util').format
var quickFormat = require('./')

Function.prototype.toJSON = function () { 
  return '[Function' + (this.name ? ': ' + this.name : '') + ']'
}

var run = bench([
  function util(cb) {
    utilFormat('%s %j %d', 'a', {a: {x: 1}}, 1)
    setImmediate(cb)
  },
  function quick(cb) {
    quickFormat(['%s %j %d', 'a', {a: {x: 1}}, 1])
    setImmediate(cb)
  },
  function utilWithTailObj(cb) {
    utilFormat('hello %s %j %d', 'world', {obj: true}, 4, {another: 'obj'})
    setImmediate(cb)
  },
  function quickWithTailObj(cb) {
    quickFormat(['hello %s %j %d', 'world', {obj: true}, 4, {another: 'obj'}])
    setImmediate(cb)
  }
], 100000)

run(run)
