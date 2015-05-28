goog.provide("ttapp.api.APIState");
goog.provide("ttapp.api.apistate");

goog.require("goog.storage.mechanism.HTML5LocalStorage");

goog.require("ttapp.Config");

/**
 * @private
 * @enum {string}
 */
ttapp.api.apistate = {
	MODULE: "apistate",
	SESSIONID: "sessid",
	SESSIONKEY: "sesskey"
};


/**
 * Module to define the current state of an API connection.
 * 
 * This state module can be used to make communication secure, even if
 * the general transport protocol has no security algorithm for data
 * protection.
 * 
 * @constructor
 */
ttapp.api.APIState = function() {
	this.init();

	return this;
};

/**
 * The session information of the currently initialized session.
 * 
 * @type {?{
 * 	id: number,
 *  key: ?string
 * }}
 */
ttapp.api.APIState.prototype._session = null;

/**
 * Initializes the session.
 * 
 * @private
 */
ttapp.api.APIState.prototype.init = function() {
	var storage = new goog.storage.mechanism.HTML5LocalStorage();
	if (storage.isAvailable) {		
		if (ttapp.Config.STORE_SESSION) {
			var id = storage.get(ttapp.api.apistate.SESSIONID);
			var key = storage.get(ttapp.api.apistate.SESSIONKEY);
			this.setSession(ttapp.stoi(id), key);
		}
	}
	ttapp.debug.log(ttapp.api.apistate.MODULE, "session: ", 
			this._session);
}

/**
 * @public
 * @param {?number=} opt_id The id of the session
 * @param {?string=} opt_key The key for the encoding of the session.
 */
ttapp.api.APIState.prototype.setSession = function(opt_id, opt_key) {
	if (goog.isDefAndNotNull(opt_id)) {
		this._session = {
			id: opt_id,
			key: opt_key || null
		};		
	} else {
		this._session = null;
	}
	
	
	var storage = new goog.storage.mechanism.HTML5LocalStorage();
	if (storage.isAvailable) {
		if (this._session === null) {
			storage.remove(ttapp.api.apistate.SESSIONID);
			storage.remove(ttapp.api.apistate.SESSIONKEY);
		} else {
			storage.set(ttapp.api.apistate.SESSIONID, "" + this._session.id);
			if (this._session.key) {
				storage.set(ttapp.api.apistate.SESSIONKEY, this._session.key);
			} else {
				storage.remove(ttapp.api.apistate.SESSIONKEY);
			}
		}
	}
};

/**
 * @return {Object}
 * @public
 */
ttapp.api.APIState.prototype.getSession = function() {
	return this._session;
}

/**
 * @return {boolean}
 * @public
 */
ttapp.api.APIState.prototype.hasSession = function() {
	return this._session != null;
}
