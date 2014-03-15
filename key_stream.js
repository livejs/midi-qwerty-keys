var Through = require('through')

var ignore = ['INPUT', 'TEXTAREA', 'SELECT']

module.exports = function KeyStream(){
  var keystream = Through()

  function send(e){
    var el = document.activeElement
    if (!el || (!~ignore.indexOf(el.nodeName) && el.contentEditable !== 'true')){
      keystream.write(e)
    }
  }

  document.addEventListener('keydown', send)
  document.addEventListener('keyup', send)

  return keystream
}