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
	USERNAME: "username",
	PASSWORD: "password",
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
 * The username of the currently logged in user.
 * This can be a page provided username or the email address used for
 * registration.
 * 
 * @type {?string}
 */
ttapp.api.APIState.prototype._username = null;

/**
 * The password of the currently logged in user.
 * If the password is not stored, the user should be asked for the
 * password on login process.
 * 
 * @type {?string}
 */
ttapp.api.APIState.prototype._password = null;

/**
 * The session information of the currently initialized session.
 * 
 * @type {?Object}
 */
ttapp.api.APIState.prototype._session = null;


ttapp.api.APIState.prototype.init = function() {
	var storage = new goog.storage.mechanism.HTML5LocalStorage();
	if (storage.isAvailable) {
		this._username = storage.get(ttapp.api.apistate.USERNAME);
		this._password = storage.get(ttapp.api.apistate.PASSWORD);
		
		if (ttapp.Config.STORE_SESSION) {
			var id = storage.get(ttapp.api.apistate.SESSIONID);
			this.setSessionId(id);
			if (id) {
				this._session.key = storage.get(ttapp.api.apistate.SESSIONKEY);
			}
		}
	}
	
	ttapp.debug.log(ttapp.api.apistate.MODULE, 
			"initialized api state for user", 
			this._username, (goog.isNull(this._password) 
			? " without password" : "with password"));
	ttapp.debug.log(ttapp.api.apistate.MODULE, "session: ", 
			this._session);
}

/**
 * @private
 */
ttapp.api.APIState.prototype.setSessionId = function(id) {
	if (!id) {
		this._session = null;
	} else {
		this._session = this._session || {};
		this._session.id = id;
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
 * @return {string}
 * @public
 */
ttapp.api.APIState.prototype.generateSession = function() {
	var key = "ASDFADSF";
	
	this._session = {
		id: null,
		key: key
	};
	
	return key;
}

/**
 * @return {boolean}
 * @public
 */
ttapp.api.APIState.prototype.hasSession = function() {
	return this._session != null;
}
