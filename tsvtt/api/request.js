/**
 * @copyright Kilian Lütkemeyer <kilian@luetkemeyer.com>
 */

goog.provide('tsvtt.api.Request');

goog.require('tsvtt.utils.base');

tsvtt.api.Request = function(p_method, p_callback) {
	var undefined;
	if (p_method != undefined) {
		this.method_ = p_method;
	}
	
	if (p_callback != undefined) {
		this.callback_ = p_callback;
	}
};
tsvtt.api.Request.prototype.callback_;
tsvtt.api.Request.prototype.method_ = tsvtt.utils.nope;


/**
 * Makes the given API send this request.
 *
 * @param {tsvtt.api.API} api The API to send this request with.
 */
tsvtt.api.Request.prototype.send = function(api) {
	api.send(this);
};