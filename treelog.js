
var logEntries = []

function log() {
  var stack = getStack()

  removeLogEntriesFromScopesWeDitched(logEntries, stack)

  var newEntryFromStack = stack[0]

  removePreviousEntryIfStillInScope(logEntries, newEntryFromStack)

  var message = Array.prototype.slice.call(arguments).map(argToString).join(" ")

  printLog(message, newEntryFromStack, logEntries)

  logEntries.push(newEntryFromStack)
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



function removeLogEntriesFromScopesWeDitched(logEntries, stack) {

  var logPosition = -1
  var stackPosition = stack.length-1
  var leaveLogUpTo = 0

  while(possibleEntryFromLog = logEntries[++logPosition]) {

    var matched = false

    // We walk backwards through the stack, looking for an entry that matches what we're looking for in the log. If we find it, we start looking for the next one. If we don't find it, we know the rest of the stack is gone, and we just move on to logging out to the console.

    for(var i=stackPosition; i>=0; i--) {

      var stackEntry = stack[i]

      matched = stackEntry.functionName == possibleEntryFromLog.functionName

      if (matched) {

        // Looks like the most recent log item is still in the stack! Leave it there and start looking for the log item before that.

        stackPosition = i-1
        leaveLogUpTo = logPosition
        matched = true

        break
      }
    }

    if (!matched) {

      // If we got to the end of the stack without finding the log entry we're looking for, we want to discard the parts of the log that we apparently moved on from.

      logEntries.splice(leaveLogUpTo)

      // And then stop looking for more:

      break
    }
  }
}



function removePreviousEntryIfStillInScope(logEntries, newEntryFromStack) {

  var previousEntry = logEntries[logEntries.length-1]

  if (!previousEntry) { return }

  var sameLineNumber = newEntryFromStack.lineNumber == previousEntry.lineNumber

  var sameFunction = newEntryFromStack.functionName == previousEntry.functionName

  if (sameFunction && !sameLineNumber) {

    // We don't want to go deeper if we're just logging again in the same function, so we pop the previous log entry off the log so there will be only one for this function.

    logEntries.pop()

    // But if we're at the exact same line again, it means we called this function again recursively and we DO want to indent.

  }
}



function printLog(message, newEntryFromStack, logEntries) {

  var emptyPrefix = repeat(" -", 21)+"  "

  var prefix = repeat(" -", logEntries.length)
    + " "
    + newEntryFromStack.functionName
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
