/**
 * @copyright Kilian Lütkemeyer <kilian@luetkemeyer.com>
 */

goog.provide('tsvtt.api.MultiRequest');

goog.require('tsvtt.api.Request');
goog.require('tsvtt.api.RequestMethod');

tsvtt.api.MultiRequest = function() {
	goog.base(this, tsvtt.api.ReqestMethod.MULTI);
}

tsvtt.api.MutliRequest.prototype.request_ = [];

tsvtt.api.MutliRequest.prototype.count = function() {
	return this.request_.length;
}

tsvtt.api.MultiRequest.prototype.send = function(api) {
	var count = this.count();
	if (count == 0) {
		return;
	} else if (count == 1) {
		this.requests_[0].send(api);
	} else {
	}
}