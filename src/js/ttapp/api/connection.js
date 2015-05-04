/**
 * @fileoverview This ...
 * @author Kilian Lütkemeyer <kilian@luetkemeyer.com>
 */
goog.provide('ttapp.api.Connection');

goog.require('goog.json');
goog.require('goog.net.XhrIo');

goog.require('ttapp.base');
goog.require('ttapp.api.encryption');

/**
 * Creates a new connection.
 * 
 * A connection handles the data transfer from server to client and the
 * other way round. A connection can only perform one request a time.
 * 
 * @constructor
 */
ttapp.api.Connection = function() {
	
	/**
	 * The callback method to handle a request.
	 * 
	 * @private
	 * @type {function(number, Object)}
	 */
	this.requestCallback_;
	
	/**
	 * The id of the current session.
	 * 
	 * @private
	 * @type {?string}
	 */
	this.sessionId_ = null;
	
	/**
	 * The current encryption method.
	 * 
	 * @private
	 * @type {Object}
	 */
	this.encryption_ = null;
	
	/**
	 * Internal number for request id generation.
	 * 
	 * @private
	 * @type {number}
	 */
	this.nextId_ = 0;
	
	/**
	 * The xhr handle.
	 * 
	 * @private
	 * @type {goog.net.XhrIo}
	 */
	this.xhr_ = new goog.net.XhrIo();
	
	
	// initialize without any encryption activated.
	this.setPlainEncryption();
	
	// register xhr listener
	goog.events.listen(this.xhr_, goog.net.EventType.COMPLETE, 
			ttapp.proxy(this._onCompleted, this)); 
};

/**
 * The result codes of any connection request.
 * 
 * @const
 * @enum {number}
 */
ttapp.api.Connection.Codes = {
	OK: 200,
	SESSION_CREATED: 201,
	SESSION_EXPIRED: 400,
	FORBIDDEN: 403,
	ERROR: 500
};

/**
 * The keys of the request and response json element.
 * 
 * @const
 * @enum {string}
 * @private
 */
ttapp.api.Connection.Keys = {
	SESSION_ID: "sid",
	ENCRYPTION_CODE: "enc",
	PAYLOAD: "data",
	STATUS_CODE: "status"
};

ttapp.api.Connection.prototype._generateRequestId = function() {
	var id = this.nextId_++;
	
	return "" + id;
}

/**
 * Handles a xhr response.
 * 
 * @param {goog.events.Event} e The completed event.
 */
ttapp.api.Connection.prototype._onCompleted = function(e) {
	console.log(e.target.getResponseJson());
}
	
/**
 * Starts a request to the server.
 * 
 * @param {Object} data The data object holding all request information
 * 	from the server.
 * @callback {!function(number, Object)} callback The callback method,
 *  used to handle the server result.
 */
ttapp.api.Connection.prototype.request = function(data, callback) {
	if (this.requestCallback_) {
		return false;
	} else {
		var req = {};
		
		var requestId = this._generateRequestId();
		var rawData = goog.json.serialize(data);
		var encrypted = this.encryption_.encrypt(rawData);
		
		req[ttapp.api.Connection.Keys.SESSION_ID] = this.sessionId_;
		req[ttapp.api.Connection.Keys.PAYLOAD] = encrypted;
	
		this.requestCallback_ = callback;
		this.xhr_.send(ttapp.Config.API_URL, ttapp.Config.API_METHOD,
			goog.json.serialize(req));
		
		return true;
	}
}

ttapp.api.Connection.prototype._setEncryption = function(id, encFunc, decFunc) {
	this.encryption_ = {
		method: id,
		encrypt: encFunc,
		decrypt: decFunc
	};
};

ttapp.api.Connection.prototype.setPlainEncryption = function() {
	this.encryption_ = ttapp.api.encryption.Plain;
};
