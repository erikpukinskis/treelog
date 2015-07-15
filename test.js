var log = require("./treelog")

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