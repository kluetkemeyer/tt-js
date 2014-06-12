/**
 * @copyright Kilian Lütkemeyer <kilian@luetkemeyer.com>
 */
 
goog.provide('tsvtt.api.TestAPI');

goog.require('tsvtt.api.API');

tsvtt.api.TestAPI = function(p_delay) {
	goog.base(this);
	
	var undefined;
	if (p_delay != undefined) {
		this.delay_ = p_delay;
	}
};
goog.inherits(tsvtt.api.TestAPI, tsvtt.api.API);

tsvtt.api.TestAPI.prototype.delay_ = 100;

tsvtt.api.TestAPI.prototype.send = function(request) {
	console.log(request);
};