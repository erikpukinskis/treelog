
var previousLogLines = []

function log() {
  var message = Array.prototype.slice.call(arguments).join(" ")
  var stack = getStack()

  var logPosition = -1
  var nextPossibleStackMatch = stack.length

  while(logItem = previousLogLines[++logPosition]) {

    var remainingStackToSearch = stack.slice(nextPossibleStackMatch, stack.length)

    var matched = false

    for(var i=nextPossibleStackMatch; i>=0; i--) {

      if (stack[i] == logItem) {

        // this log item is still in the stack! leave it there and look for the next log item
        nextPossibleStackMatch = i-1
        matched = true
        break
      }
    }

    if (!matched) {
      // we're no longer within the stack frame of the previous log item.

      // Pop everything after this off the stack:

      previousLogLines = previousLogLines.slice(0, logPosition)

      // And then stop looking for more:

      break
    }
  }

  // If we're in the same function we were in last time, we don't need to indent for it:

  if (previousLogLines[previousLogLines.length-1] == stack[0]) {
    previousLogLines.pop()
  }

  var prefix = repeat(" -", previousLogLines.length)+" "+stack[0]

  if (prefix.length < 40) {
    var padding = Math.floor((40 - prefix.length) / 2)
    if (prefix.length + padding*2 < 40) {
      prefix = prefix + " "
    }
    prefix = prefix + repeat(" -", padding)
  }

  prefix = prefix+"  "

  message.split("\n").forEach(
    function(message) {
      console.log(
        prefix, message)
    }
  )

  previousLogLines.push(stack[0])
}

function getStack() {
  try {
    throw new Error()
  } catch(e) {
    return e.stack.split("\n").slice(3).map(function(line) {
      var func = line.match(/at ([^( ]+)/)[1]
      var lineNumber = line.match(/(:[0-9]+):/)[1]

      return func
    })
  }
}

function repeat(string, count) {
  var targetLength = string.length * count

  for(var repeated = ''; repeated.length < targetLength; repeated += string){}

  return repeated 
}

module.exports = log
