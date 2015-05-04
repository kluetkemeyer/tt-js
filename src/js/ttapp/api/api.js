goog.provide("ttapp.api.API");


goog.require("ttapp.api.APIState");
goog.require("ttapp.debug");
goog.require("ttapp.crypt.base");
goog.require('ttapp.base');

/**
 * @enum {string|number}
 * @private
 */
ttapp.api.api = {
	MODULE:	"api",
	
	INIT_RETRY: 3,
	
	KEY_COMMAND: "cmd",
	KEY_SESSID: "sid",
	KEY_PAYLOAD: "data"
	
	ENCRYPT_PLAIN : "plain"
};

/**
 * @const
 * @enum {string}
 */
ttapp.api.APIEventType = {
	START_REQUEST: "REQUEST",
	INIT_SESSION: "INITIALIZE",
	AUTH_LOGIN: "LOGIN",
	AUTH_LOGOUT: "LOGOUT",
	AUTH_SUCCES: "LOGGED_IN",
	AUTH_FAILED: "LOGIN_FAILED"
};

/**
 * Creates a new api interface.
 * 
 * @constructor
 * @extends {goog.events.EventTarget}
 */
ttapp.api.API = function() {
	/**
	 * The state of the api connection.
	 * 
	 * @type {ttapp.api.APIState}
	 */
	this._state = new ttapp.api.APIState();
	
	/**
	 * The request queue.
	 * 
	 * This queue holds all requests to handle.
	 * @type {Array<Object>}
	 */
	this._queue = [];
	
	/**
	 * The current request.
	 * 
	 * Holds the record for the current request.
	 */
	this._currentRequest = null;
	
	/**
	 * Holds the encryption methods and instances.
	 * These methods are used for fast and performant access and request
	 * encryption handling.
	 * 
	 * @const {Object}
	 * @private
	 */
	this._encryption = {};
	if (ttapp.Config.USE_ENCRYPTION) {
		this._encryption.session = {
			encrypt: this._encryptBySession, this,
			decrypt: this._decryptBySession, this
		};
		this._encryption.other = {
			factory: this._createAsymEncryption
		};
	} else {
		var plain = {
			name: ttapp.api.api.ENCRYPT_PLAIN,
			encrypt: this._encryptPlain, this,
			decrypt: this._encryptPlain, this
		}
		this._encryption.session = plain;
		this._encryption.other = plain;
	}
			
	
	goog.events.listen(this._xhr, goog.net.EventType.COMPLETE, 
			ttapp.proxy(this._requestCompletedCallback, this)); 
};
goog.inherits(ttapp.api.API, goog.events.EventTarget);

ttapp.api.API.prototype._requestCompletedCallback = function() {
	console.log(arguments);
}

ttapp.api.API.prototype._encryptPlain = function(plain) {
	return plain;
}

ttapp.api.API.prototype._encryptBySession = function(plain) {
};

ttapp.api.API.prototype._decryptBySession = function(cipher) {
};

/**
 * @private
 */
ttapp.api.API.prototype._handleQueue = function() {
	if (this._currentRequest == null && this._queue.length > 0) {
		var session = this._state.getSession();
		var req = null;
		if (session == null) {
			req = {
				encrypt: this._encryption.other
			}
		} else {			
			this._currentRequest = this._queue.shift();
		}
	};
}

/**
 * Adds a request to the request queue.
 * 
 * @param {ttapp.api.APIRequest} request The request to add to the
 * 		queue.
 * @public
 */
ttapp.api.API.prototype.addRequest = function(command, plainData, callback) {
	var content = {};
	content[ttapp.api.api.KEY_COMMAND] = command;
	content[ttapp.api.api.KEY_PAYLOAD] = plainData;
	
	
	
	this._queue.push(reqObject);
		
};
