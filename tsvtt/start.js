goog.provide('tsvtt.start');

goog.require('goog.dom');
goog.require('tsvtt.model.Player');
goog.require('tsvtt.api.TestAPI');

tsvtt.start = function() {
  var api = new tsvtt.api.TestAPI(1000);
  
  var newDiv = goog.dom.createDom('h1', {'style': 'background-color:#EEE'},
    'Hello world!');
  goog.dom.appendChild(document.body, newDiv);
  
  var person = new tsvtt.model.Person({firstname: "Kilian"});
  var player = new tsvtt.model.Player(person);
  api.send(player);
};

// Ensures the symbol will be visible after compiler renaming.
goog.exportSymbol('tsvtt.start', tsvtt.start);