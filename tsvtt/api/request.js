/**
 * @copyright Kilian Lütkemeyer <kilian@luetkemeyer.com>
 */

goog.provide('tsvtt.api.Request');
goog.provide('tsvtt.api.RequestMethod');

tsvtt.api.RequestMethod = {
	GET: "GET",
	POST: "POST",
	PUT: "PUT",
	MULTI: "MULTI"
};

tsvtt.api.Request = function(p_method) {
	var undefined;
	if (p_method != undefined) {
		this.method_ = p_method;
	}
};
tsvtt.api.Request.prototype.method_ = tsvtt.api.RequestMethod.GET;


/**
 * Makes the given API send this request.
 *
 * @param {tsvtt.api.API} api The API to send this request with.
 */
tsvtt.api.Request.prototype.send = function(api) {
	api.send(this);
};