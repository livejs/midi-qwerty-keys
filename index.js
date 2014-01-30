var Through = require('through')
var keycode = require('keycode')
var KeyStream = require('./key_stream')

module.exports = function(options){

  options = options || {}

  var currentOffset = options.offset || 0
  var currentVelocity = options.velocity || 127
  var chan = options.channel || 0

  var modes = {
    'piano': {
      notes: "AWSEDFTGYHUJKOLP;['".toLowerCase().split(''),
      offsetBy: 12,
      offset: ['z', 'x'],
      velocity: ['c', 'v']
    },
    'grid': {
      notes: 'QWERTYUIASDFGHJKZXCVBNM,'.toLowerCase().split(''),
      offsetBy: 8,
      offset: ['-', '='],
      velocity: ['[', ']']
    }
  }

  var commands = {}

  var mode = modes[options.mode || 'keys']

  commands[mode.offset[0]] = function octDown(){
    currentOffset = Math.max(-mode.offsetBy, currentOffset - mode.offsetBy)
  }

  commands[mode.offset[1]] = function octUp(){
    currentOffset = Math.min(127-mode.notes.length, currentOffset + mode.offsetBy)
  }

  commands[mode.velocity[0]] = function velDown(){
    currentVelocity = Math.max(0, currentVelocity - 16)
  }

  commands[mode.velocity[1]] = function velUp(){
    currentVelocity = Math.min(127, currentVelocity + 16)
  }
  
  var notes = mode.notes

  var keyboard = Through(function(e){
    var note = getNote(e)
    if (note){
      this.queue(note)
    } else {
      command(e)
    }
  })

  if (global.document && global.document.addEventListener && options.bind !== false){
    KeyStream().pipe(keyboard)
  }

  var ups = {}

  function getNote(e){
    var id = notes.indexOf(keycode(e.keyCode))
    if (~id){
      if (e.type == 'keyup'){
        var up = ups[id]
        ups[id] = null
        return up
      } else {
        if (!ups[id]){
          ups[id] = [144+chan||0, id+currentOffset, 0]
          return [144+chan||0, id+currentOffset, currentVelocity]
        }
      }
    }
  }

  function command(e){
    if (e.type == 'keydown'){
      var command = commands[keycode(e.keyCode)]
      if (typeof command === 'function'){
        command()
      }
    }
  }

  return keyboard
}