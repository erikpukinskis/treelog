var ramda = require("ramda")
var filter = ramda.filter
var contains = ramda.contains

var logEntries = []

function log() {
  var stack = getStack()

  var message = Array.prototype.slice.call(arguments).map(argToString).join(" ")

  logEntries.push(stack[0])

  function inSameFunction(a, b) {
    return a.functionName == b.functionName
  }

  var functionsInLog = logEntries.map(
    function(entry) {
      return entry.functionName
    }
  )

  function inLog(entry) {
    var isIn = contains(entry.functionName)(functionsInLog)
    return isIn
  }

  activeEntries = filter(inLog)(stack)

  var depth = calculateDepth(activeEntries)

  printLog(message, depth, stack[0])

}



function getStack() {
  try {
    throw new Error()
  } catch(e) {

    return e.stack.split("\n").slice(3).map(function(line) {

      var functionName = line.match(/at ([^( ]+)/)[1]
      var lineNumber = line.match(/:[0-9]+:/)[0]

      return {
        functionName: functionName,
        line: lineNumber
      }
    })
  }
}


function printLog(message, depth, newEntry) {

  var emptyPrefix = repeat(" -", 21)+"  "

  var prefix = repeat(" -", depth)
    + " "
    + newEntry.functionName
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




function calculateDepth(entries) {

  var functionsSeen = []
  var linesSeen = []
  var depth = 0

  for(var i=0; i<entries.length; i++) {

    var entry = entries[i]
    var line = entry.functionName+entry.lineNumber

    var sameFunction = contains(entry.functionName)(functionsSeen)

    var sameLine = contains(line)(linesSeen)

    if (!sameFunction) {
      depth++
    } else if (sameFunction && sameLine) {
      // recursion!
      depth++
    } else {
      // already saw this function. just logging more stuff.
    }

    functionsSeen.push(entry.functionName)
    linesSeen.push(line)
  }

  return depth
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
