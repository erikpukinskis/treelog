var ramda = require("ramda")
var filter = ramda.filter
var contains = ramda.contains

var logEntries = []

function log() {
  var stack = getStack()

  var message = Array.prototype.slice.call(arguments).map(argToString).join(" ")

  logEntries.push(stack[0])

  function inLog(entry) {
    return contains(entry)(logEntries)
  }

  logEntries = filter(inLog)(stack)

  var depth = logEntries.length

  printLog(message, depth, stack[0])
}


function getStack() {
  try {
    throw new Error()
  } catch(e) {

    return e.stack.split("\n").slice(3).map(function(line) {

      var functionName = line.match(/at ([^( ]+)/)[1]

      return functionName
    })
  }
}


function printLog(message, depth, newEntry) {

  var emptyPrefix = repeat(" -", 21)+"  "

  var prefix = repeat(" -", depth)
    + " "
    + newEntry
    + " →"

  if (prefix.length < 40) {
    var padding = Math.floor((40 - prefix.length) / 2)
    if (prefix.length + padding*2 < 40) {
      prefix = prefix + " "
    }
    prefix = prefix + repeat(" -", padding)
  }

  prefix = prefix+"  "

  var first = true
  message.split("\n").forEach(
    function(message) {

      console.log(first ? prefix : emptyPrefix, message)

      first = false
    }
  )
}



// Helpers

function repeat(string, count) {
  var targetLength = string.length * count

  for(
    var repeated = '';
    repeated.length < targetLength;
    repeated += string
  ) {
  }

  return repeated 
}

function argToString(arg) {
  if (typeof arg == "object") {
    return JSON.stringify(arg)
  } else {
    return arg
  }
}



module.exports = log
