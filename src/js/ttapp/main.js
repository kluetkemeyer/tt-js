goog.provide('ttapp.main');

goog.require('goog.dom');

goog.require('ttapp.debug');
goog.require("ttapp.api.Connection");

/**
 * @export
 */
ttapp.main = function() {
var newHeader = goog.dom.createDom('h1', {'style': 'background-color:#EEE'},
    'Hello world!');
  goog.dom.appendChild(document.body, newHeader);
  
  var api = new ttapp.api.Connection();
  api.request({"cmd": "dump", "data": "Hallo Welt"});
 
  
  ttapp.debug.log("main", "application started");
};
