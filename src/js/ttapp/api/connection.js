/**
 * @fileoverview This ...
 * @author Kilian Lütkemeyer <kilian@luetkemeyer.com>
 */
goog.provide('ttapp.api.Connection');

goog.require('goog.json');
goog.require('goog.net.XhrIo');

goog.require('ttapp.base');
goog.require('ttapp.debug');
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
	 * @type {?function(number, Object)}
	 */
	this.requestCallback_;
	
	/**
	 * The id of the current session.
	 * 
	 * @private
	 * @type {?number}
	 */
	this.sessionId_ = null;
	
	/**
	 * The current encryption method.
	 * 
	 * @private
	 * @type {!ttapp.api.encryption.Encryption}
	 */
	this.encryption_;
	
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
 * The module name for debugging.
 * 
 * @const
 * @private
 */
ttapp.api.Connection.MODULE = "ApiConnection";

/**
 * The result codes of any connection request.
 * 
 * @const
 * @enum {number}
 */
ttapp.api.Connection.Codes = {
	OK: 200,
	INVALID_REQUEST: 400,
	SESSION_EXPIRED: 401,
	FORBIDDEN: 403,
	INVALID_RESPONSE: 405,
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
	USER_ID: "uid",
	PAYLOAD: "data",
	STATUS_CODE: "status"
};

/**
 * Handles a xhr response.
 * 
 * @param {!goog.events.Event} e The completed event.
 */
ttapp.api.Connection.prototype._onCompleted = function(e) {
	var cbdata = {
		status: ttapp.api.Connection.Codes.ERROR,
		data: null
	};
	try {
		var response = e.target.getResponseJson();
		var content = response[ttapp.api.Connection.Keys.PAYLOAD];
		
		cbdata.status = response[ttapp.api.Connection.Keys.STATUS_CODE];	
		if (cbdata.status == 200) {
			content = this.encryption_.decrypt(content);
			
			try {
				content = goog.json.parse(content);
			} catch (ex) {
				cbdata.status = ttapp.api.Connection.Codes.INVALID_RESPONSE;
			}
		}
		
		cbdata.data = content;		
	} catch(ex) {
		cbdata.status = ttapp.api.Connection.Codes.INVALID_RESPONSE;
		cbdata.data = e.target.getResponseText();
	}
	
	ttapp.debug.log(ttapp.api.Connection.MODULE, "receiving response", 
		cbdata.status, cbdata.data);
		
	if (this.requestCallback_) {
		var cb = this.requestCallback_;
		this.requestCallback_ = null;
		cb(cbdata.status, cbdata.data);
	}
}

/**
 * Checks, if the connection is working at the moment.
 * 
 * @return {!boolean}
 * @public
 */
ttapp.api.Connection.prototype.isWorking = function() {
	if (this.requestCallback_) {
		return true;
	} else {
		return false;
	}
}
	
/**
 * Starts a request to the server.
 * 
 * @public
 * @param {!Object} data The data object holding all request information
 * 	from the server.
 * @param {!function(number, Object)} callback The callback method,
 *  used to handle the server result.
 */
ttapp.api.Connection.prototype.request = function(data, callback) {
	if (this.requestCallback_) {
		return false;
	} else {
		var req = {};
		
		ttapp.debug.log(ttapp.api.Connection.MODULE, "sending request", this.sessionId_, data);
		
		var rawData = goog.json.serialize(data);
		var encrypted = this.encryption_.encrypt(rawData);
		
		req[ttapp.api.Connection.Keys.SESSION_ID] = this.sessionId_;
		req[ttapp.api.Connection.Keys.ENCRYPTION_CODE] = this.encryption_.method;
		req[ttapp.api.Connection.Keys.PAYLOAD] = encrypted;
	
		this.requestCallback_ = callback;
		this.xhr_.send(ttapp.Config.API_URL, ttapp.Config.API_METHOD,
			goog.json.serialize(req));
		
		return true;
	}
}

/**
 * @private
 * @param {!number} id
 * @param {!ttapp.api.encryption.CryptFunction} encFunc
 * @param {!ttapp.api.encryption.CryptFunction} decFunc
 */
ttapp.api.Connection.prototype._setEncryption = function(id, encFunc, decFunc) {
	this.encryption_ = {
		method: id,
		encrypt: encFunc,
		decrypt: decFunc
	};
};

/**
 * @public
 */
ttapp.api.Connection.prototype.setPlainEncryption = function() {
	this.encryption_ = ttapp.api.encryption.Plain;
};

/**
 * @public
 * @param {?number=} sessId The id of the session.
 * @param {?string=} sessKey The key of the session.
 */
ttapp.api.Connection.prototype.setSession = function(sessId, sessKey) {
	this.sessionId_ = sessId || null;
	if (sessKey) {
		this.setSessionEncryption(sessKey);
	}
};

/**
 * @private
 * @param {!string} sessionKey
 */
ttapp.api.Connection.prototype.setSessionEncryption = function(sessionKey) {
	
};
