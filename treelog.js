
var logEntries = []
/*
watch("logPosition")
watch("logEntries")
watch("stackPosition")
watch("stack")
watch("stackEntry")
watch("possibleEntryFromLog")
watch("newEntryFromStack")
watch("remainingStackToSearch")
*/
function log() {
  var message = Array.prototype.slice.call(arguments).map(argToString).join(" ")
  var stack = getStack()

  debugger

  removeLogEntriesFromScopesWeDitched(logEntries, stack)

  var newEntryFromStack = stack[0]

  removePreviousEntryIfStillInScope(logEntries, newEntryFromStack)

  printLog(message, newEntryFromStack, logEntries)

}

function getStack() {
  try {
    throw new Error()
  } catch(e) {

    return e.stack.split("\n").slice(3).map(function(line) {

      var reference = line.match(/at ([^( ]+)/)[1]
      var lineNumber = line.match(/(:[0-9]+):/)[1]

      return {
        reference: reference,
        line: lineNumber
      }
    })
  }
}

function removeLogEntriesFromScopesWeDitched(logEntries, stack) {

  var logPosition = -1
  var stackPosition = stack.length-1

  while(possibleEntryFromLog = logEntries[++logPosition]) {

    debugger

    var remainingStackToSearch = stack.slice(stackPosition, stack.length) // debug only

    var matched = false

    // We walk backwards through the stack, looking for the possibleEntryFromLog. If we find it, we start looking for the next one. If we don't find it, we know the rest of the stack is gone, and we just move on to logging out to the console.

    for(var i=stackPosition; i>=0; i--) {

      var stackEntry = stack[i]
      debugger

      if (stackEntry.reference == possibleEntryFromLog.reference) {

        // Looks like the most recent log item is still in the stack! Leave it there and start looking for the log item before that.

        stackPosition = i-1
        matched = true
        break
      }
    }

    if (!matched) {

      // If we got to the end of the stack without finding the log entry we're looking for, we want to discard the parts of the log that we apparently moved on from.

      debugger

      logEntries = logEntries.slice(0, logPosition)

      // And then stop looking for more:

      break
    }
  }
}

function removePreviousEntryIfStillInScope(logEntries, newEntryFromStack) {

  var previousEntry = logEntries[logEntries.length-1]

  debugger 

  if (previousEntry) {
    var sameLineNumber = newEntryFromStack.lineNumber == previousEntry.lineNumber

    var sameReference = newEntryFromStack.reference == previousEntry.reference

    debugger 

    if (sameReference && sameLineNumber) {

      debugger 

      // We DO want to indent if the line number is the same, because it means it's a second run

    } else if (sameReference && !sameLineNumber) {

      // We're in the same function as before but the line number is different. we assume we're in the same scope, so we pop the last one off the stack

      debugger 

      logEntries.pop()

    } else {

      debugger 

      // different reference, definitely leave the previous one in place so the next one is added on top
    }
  }
}

function printLog(message, newEntryFromStack, logEntries) {

  var prefix = repeat(" -", logEntries.length)+" "+newEntryFromStack.reference

  if (prefix.length < 40) {
    var padding = Math.floor((40 - prefix.length) / 2)
    if (prefix.length + padding*2 < 40) {
      prefix = prefix + " "
    }
    prefix = prefix + " →"
    prefix = prefix + repeat(" -", padding)
  }

  prefix = prefix+"  "
  var emptyPrefix = repeat(" -", 21)+"  "
  var first = true
  message.split("\n").forEach(
    function(message) {
      console.log(
        first ? prefix : emptyPrefix, message)
      first = false
    }
  )

  logEntries.push(newEntryFromStack)

  debugger 
}


// Helpers

function repeat(string, count) {
  var targetLength = string.length * count

  for(var repeated = ''; repeated.length < targetLength; repeated += string){}

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
