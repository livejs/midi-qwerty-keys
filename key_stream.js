var Through = require('through')

var ignore = ['INPUT', 'TEXTAREA', 'SELECT']

module.exports = function KeyStream(){
  var keystream = Through()

  function send(e){
    if (!document.activeElement || !~ignore.indexOf(document.activeElement.nodeName)){
      keystream.write(e)
    }
  }

  document.addEventListener('keydown', send)
  document.addEventListener('keyup', send)

  return keystream
}