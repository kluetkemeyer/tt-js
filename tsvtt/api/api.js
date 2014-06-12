/**
 * @copyright Kilian Lütkemeyer <kilian@luetkemeyer.com>
 */
 
goog.provide('tsvtt.api.API');

tsvtt.api.API = function() {};

tsvtt.api.API.prototype.send = function(request) {
	throw "abstract API cannot be used!";
};