var log = require("./treelog")

function makeBreakfast() {
  log("so hungry")
  toast()
}

function toast() {
  log("bread is soft")
  turnOnStove()
  log("so toasty!")
}

function turnOnStove() {
  log("ignition!")
}

makeBreakfast()
