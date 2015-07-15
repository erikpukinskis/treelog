Treelog prints out your logs along with the functions they were called from, and arranges them in a tree based on a stacktrace:

```javascript
var log = require("treelog")

function makeBreakfast() {
  log("so hungry")
  toast()
}

function toast() {
  log("bread is soft")
  stove.on()
  log("so toasty!")
}

var stove = {
  on: function() {
    log("ignition!")
  }
}

makeBreakfast()
```

Will log out:

```
 makeBreakfast - - - - - - - - - - - - - → so hungry
 - toast - - - - - - - - - - - - - - - - → bread is soft
 - - Object.stove.on - - - - - - - - - - → ignition!
 - toast - - - - - - - - - - - - - - - - → so toasty!
```
