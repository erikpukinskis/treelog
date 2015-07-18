var log = require("./treelog")

var toastCount = 2
function makeBreakfast() {
  log("so hungry")
  toast()
  if (toastCount > 0)
  makeBreakfast()
}

function toast() {
  log("bread is soft")
  stove.on()
  log("so toasty!")
  toastCount--
}

var stove = {
  on: function() {
    stove.isOn = true
    log("ignition!")
  }
}

makeBreakfast()
