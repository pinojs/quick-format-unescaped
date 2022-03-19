'use strict'
function tryStringify(o) {
  try {
    return JSON.stringify(o)
  } catch (e) {
    return '"[Circular]"'
  }
}

const CHAR_PERCENT = '%'.charCodeAt(0)
const CHAR_s = 's'.charCodeAt(0)
const CHAR_d = 'd'.charCodeAt(0)
const CHAR_f = 'f'.charCodeAt(0)
const CHAR_i = 'i'.charCodeAt(0)
const CHAR_O = 'O'.charCodeAt(0)
const CHAR_o = 'o'.charCodeAt(0)
const CHAR_j = 'j'.charCodeAt(0)

module.exports = function build(opts) {
  // Keep (custom) formatters in a map for easy lookup
  const formatters = {}

  Object.keys((opts || {}).formatters || {}).forEach(key => {
    // For now, only support single character keys
    if (key.length > 1)
      throw new Error(`Formatter %${key} has more than one character`)
    if (typeof opts.formatters[key] !== 'function')
      throw new Error(`Formatter for %${key} is not a function`)

    const c = key.charCodeAt(0)
    formatters[c] = opts.formatters[key]
  })

  function format(f, args, opts) {
    var ss = (opts && opts.stringify) || tryStringify
    var offset = 1
    if (typeof f === 'object' && f !== null) {
      var len = args.length + offset
      if (len === 1) return f
      var objects = new Array(len)
      objects[0] = ss(f)
      for (var index = 1; index < len; index++) {
        objects[index] = ss(args[index])
      }
      return objects.join(' ')
    }
    if (typeof f !== 'string') {
      return f
    }
    var argLen = args.length
    if (argLen === 0) return f
    var str = ''
    var a = 1 - offset
    var lastPos = -1
    var flen = (f && f.length) || 0
    for (var i = 0; i < flen; ) {
      if (f.charCodeAt(i) === CHAR_PERCENT && i + 1 < flen) {
        lastPos = lastPos > -1 ? lastPos : 0
        const c = f.charCodeAt(i + 1)
        switch (c) {
          case CHAR_d:
          case CHAR_f:
            if (a >= argLen) break
            if (args[a] == null) break
            if (lastPos < i) str += f.slice(lastPos, i)
            str += Number(args[a])
            lastPos = i + 2
            i++
            break
          case CHAR_i:
            if (a >= argLen) break
            if (args[a] == null) break
            if (lastPos < i) str += f.slice(lastPos, i)
            str += Math.floor(Number(args[a]))
            lastPos = i + 2
            i++
            break
          case CHAR_O:
          case CHAR_o:
          case CHAR_j:
            if (a >= argLen) break
            if (args[a] === undefined) break
            if (lastPos < i) str += f.slice(lastPos, i)
            var type = typeof args[a]
            if (type === 'string') {
              str += "'" + args[a] + "'"
              lastPos = i + 2
              i++
              break
            }
            if (type === 'function') {
              str += args[a].name || '<anonymous>'
              lastPos = i + 2
              i++
              break
            }
            str += ss(args[a])
            lastPos = i + 2
            i++
            break
          case CHAR_s:
            if (a >= argLen) break
            if (lastPos < i) str += f.slice(lastPos, i)
            str += String(args[a])
            lastPos = i + 2
            i++
            break
          case CHAR_PERCENT:
            if (lastPos < i) str += f.slice(lastPos, i)
            str += '%'
            lastPos = i + 2
            i++
            a--
            break
        }

        // Apply any formatters
        if (formatters[c]) {
          str += formatters[c](args[a])
          lastPos = i + 2
          i++
        }

        ++a
      }
      ++i
    }
    if (lastPos === -1) return f
    else if (lastPos < flen) {
      str += f.slice(lastPos)
    }

    return str
  }

  return format
}
