goog.provide("ttapp.api.API");

goog.require('goog.events.EventTarget');

goog.require("ttapp.api.APIState");
goog.require("ttapp.api.Connection");
goog.require("ttapp.debug");


/**
 * @enum {string}
 * @public
 */
ttapp.api.APIEventType = {
	START: 'START',
	FINISH: 'FINISH',
	LOGIN_SUCCESS: 'LOGIN',
	LOGIN_FAILURE: 'AUTH_FAIL',
	LOGOUT: 'LOGOUT'
};

/**
 * Creates a new api interface.
 * 
 * @constructor
 * @extends {goog.events.EventTarget}
 */
ttapp.api.API = function() {
	ttapp.api.API.base(this, 'constructor');
	
	/**
	 * The state of the api connection.
	 * 
	 * @private
	 * @type {ttapp.api.APIState}
	 */
	this.config_ = new ttapp.api.APIState();
	
	/**
	 * 
	 * @type {ttapp.api.Connection}
	 * @private
	 */
	this.conn_ = new ttapp.api.Connection();
	
	this.logindata_ = null;
	
	/**
	 * The request queue.
	 * 
	 * This queue holds all requests to handle.
	 * @type {Array<Object>}
	 * @private
	 */
	this.queue_ = [];
	
	/**
	 * The current state of the api.
	 * 
	 * @type {number}
	 * @private
	 */
	this.state_ = ttapp.api.API.States.NOSESSION;
	
	
	this.requestLoginData_ = function(cb) {
		cb(null);
	};
	
	
	this.init();
	
};
goog.inherits(ttapp.api.API, goog.events.EventTarget);


ttapp.api.API.MODULE = "API";

/**
 * @const
 * @private
 * @enum {number}
 */
ttapp.api.API.States = {
	NOSESSION: 0,
	PING: 1,
	ANONYMOUS: 2,
	USER: 3,
	SESSION: 4,
	AUTHENTICATE: 5,
	ASKING: 6
};
	
/**
 * @const
 * @private
 * @enum {string}
 */
ttapp.api.API.JsonKeys = {
	COMMAND: "cmd",
	STATUS: "status",
	PAYLOAD: "data",
	RESPONSE_PAYLOAD: "cmd",
	RESPONSE_USERID: "uid",
	RESPONSE_SID: "sid",
	
	AUTH_USERNAME: "user",
	AUTH_PASSWORD: "passwd",
	AUTH_FULLNAME: "name"
};

ttapp.api.API.Commands = {
	SESSION_INIT: "initSession",
	MULTI: "multi",
	PING: "ping",
	LOGIN: "login",
	LOGOUT: "logout"
};

/**
 * @private
 */
ttapp.api.API.prototype.clearSession = function() {
	this.state_ = ttapp.api.API.States.NOSESSION;
	this.config_.setSession(null);
	this.conn_.setPlainEncryption();
};

ttapp.api.API.prototype.init = function() {
	if (this.config_.hasSession()) {
		var session = this.config_.getSession();
		this.state_ = ttapp.api.API.States.PING;
		this.conn_.setSession(session.id, session.key);
	} else {
		this._fireInvalidSession();
	}	
};

ttapp.api.API.prototype._onInitSession = function(status, data, sid, uid) {
	if (status == 200) {
		this.config_.setSession(sid, data);
		this.conn_.setSession(sid, data);
		
		if (uid) {
			this.state_ = ttapp.api.API.States.USER;
		} else {
			this.state_ = ttapp.api.API.States.SESSION;
		}
	}	
}

/**
 * @private
 * @param {string} eventType
 */
ttapp.api.API.prototype._triggerEvent = function(eventType) {
	goog.events.dispatchEvent(this, eventType);
}

ttapp.api.API.prototype._onLogin = function(status, data, sid, uid) {
	if (status == 200) {
		ttapp.debug.log(ttapp.api.API.MODULE, "logged in as ",
			data[ttapp.api.API.JsonKeys.AUTH_FULLNAME]);
		this.state_ = ttapp.api.API.States.USER;
	this._triggerEvent(ttapp.api.APIEventType.LOGIN_SUCCESS);
	} else {
		ttapp.debug.log(ttapp.api.API.MODULE, "login failed");
		this.state_ = ttapp.api.API.States.ANONYMOUS;
	this._triggerEvent(ttapp.api.APIEventType.LOGIN_FAILURE);
	}
}

ttapp.api.API.prototype._onLogout = function() {
	ttapp.debug.log(ttapp.api.API.MODULE, "visitor mode");
	this.state_ = ttapp.api.API.States.ANONYMOUS;
	this._triggerEvent(ttapp.api.APIEventType.LOGOUT);
}

ttapp.api.API.prototype._triggerStartRequest = function() {
	ttapp.debug.log(ttapp.api.API.MODULE, "starting requests");
	this._triggerEvent(ttapp.api.APIEventType.START);
}
ttapp.api.API.prototype._triggerFinishRequest = function() {
	ttapp.debug.log(ttapp.api.API.MODULE, "finishing requests");
	this._triggerEvent(ttapp.api.APIEventType.FINISH);
}

ttapp.api.API.prototype._handleQueue = function() {
	// abort if queue is empty
	if (this.conn_.isWorking()) {
		return;
	}
	
	if (this.queue_.length == 0) {
		this._triggerFinishRequest();
		return;
	}
	
	this._triggerStartRequest();
	
	var States = ttapp.api.API.States;
	var Commands = ttapp.api.API.Commands;
	
	var request = null;
	
	if (this.state_ == States.NOSESSION) {
		request = this._buildRequest(Commands.SESSION_INIT, 
			null, ttapp.proxy(this._onInitSession, this));
	} else if (this.state_ == States.PING) {
		request = this._buildRequest(Commands.PING,
			null, ttapp.proxy(this._onPing, this));
	} else if (this.state_ == States.SESSION) {
		this._setState(States.ASKING);
		this.requestLoginData_(ttapp.proxy(this.authenticate, this));
	} else if (this.state_ == States.AUTHENTICATE) {
		request = this._buildLoginRequest(this.logindata_.username,
					this.logindata_.password);
		this.logindata_ = null;
	} else {
		var requests = this.queue_;
		this.queue_ = [];
		
		request = this._buildMultiRequest(requests);
	}
	
	if (request) {
		this.conn_.request(request.content, request.callback);
	}
}

ttapp.api.API.prototype._buildMultiRequest = function(requests) {
	var requestData = [];
	var c = requests.length;
	for(var i=0; i<c; ++i) {
		requestData.push(requests[i].content);
	}
		
	
	var callback = function(status, data) {
		var c2 = data.length;
		if (c2 == c) {
			var fields = ttapp.api.API.JsonKeys;
			for(var i=0; i<c; ++i) {
				requests[i].callback(data[i][fields.STATUS],
						data[i][fields.PAYLOAD]);
			}
		}
	};
	
	return this._buildRequest(ttapp.api.API.Commands.MULTI,
		requestData, callback);
}

/**
 * Sets the state to the given value
 *
 * @param {number} newState The new state.
 */
ttapp.api.API.prototype._setState = function(newState) {
	var oldState = this.state_;
	this.state_ = newState;

	// fire state change listeners
	ttapp.debug.log(ttapp.api.API.MODULE, "Set state to " + newState + " (was " + oldState + " before.)");
}

/**
 * Sets the api to the state of an invalid session.
 * 
 * @private
 */
ttapp.api.API.prototype._fireInvalidSession = function() {
	this.config_.setSession();
	this.conn_.setSession();
	this._setState(ttapp.api.API.States.NOSESSION);
}
	

ttapp.api.API.prototype._buildLoginRequest = function(user, password) {
	var content = {};
	var fields = ttapp.api.API.JsonKeys;
	content[fields.AUTH_USERNAME] = user;
	content[fields.AUTH_PASSWORD] = password;
	
	
	return this._buildRequest(ttapp.api.API.Commands.LOGIN, content,
		ttapp.proxy(this._onLogout, this));
}

ttapp.api.API.prototype.authenticate = function(user, password) {
	if (user) {
		this.state_ = ttapp.api.API.States.AUTHENTICATE;
		this.logindata_ = {
			username: user,
			password: password
		};
	} else {
		this.state_ = ttapp.api.API.States.ANONYMOUS;
	}
	
	this._handleQueue();
};
	

/**
 * @private
 */
ttapp.api.API.prototype._onPing = function(status, data, sid, uid) {
	ttapp.debug.log(ttapp.api.API.MODULE, "PING", status, sid, uid);
	
	var States = ttapp.api.API.States;
	if (status == 200 && sid) {
		if (uid) {
			this._setState(States.USER);
		} else {
			this._setState(States.SESSION);
		}
	} else {
		this._fireInvalidSession();
	}
};

/**
 * @private
 * @param {!string} command The command of the request.
 * @param {*} data The data to append for the request.
 * @param {!function(number, *, ?number, ?number)} callback The callback of this request.
 * @param {?boolean=} opt_buildFlat If this flag is true, no further request queue handling is done after finishing this request.
 */
ttapp.api.API.prototype._buildRequest = function(command, data, callback, opt_buildFlat) {
	var content = {};
	content[ttapp.api.API.JsonKeys.COMMAND] = command;
	content[ttapp.api.API.JsonKeys.PAYLOAD] = data;
	
	var api = this;
	var cb = callback;
	if (!opt_buildFlat) {
		cb = function(status, data) {
			api._handleAnyResponse(status, data, callback);
		}
	}
	
	return {
		content: content,
		callback: cb
	};
}

ttapp.api.API.prototype._handleAnyResponse = function(status, data, callback) {
	var stop = false;
	var States = ttapp.api.API.States;
	if (status == 200) {
		var Keys = ttapp.api.API.JsonKeys;
		var cmdData = data[Keys.RESPONSE_PAYLOAD];
		
		callback(cmdData[Keys.STATUS], cmdData[Keys.PAYLOAD],
			data[Keys.RESPONSE_SID], data[Keys.RESPONSE_USERID]);
	} else if (status == 401) {
		this._fireInvalidSession();
	} else {
		ttapp.debug.err(ttapp.api.API.MODULE, "Unexpected response", status, data);
		stop = true;
	}
	
	if (!stop) {
		var api = this;
		setTimeout(function() { api._handleQueue() }, 0);
	}
}

/**
 * Adds a request to the request queue.
 * 
 * @param {string} command The command of the request
 * @param {*} data The data to be sent with the request
 * @param {function(number, *, ?number, ?number)} callback The callback method.
 * @public
 */
ttapp.api.API.prototype.addRequest = function(command, data, callback) {
	this.queue_.push(this._buildRequest(command, data, callback, true));
	this._handleQueue();	
};

goog.addSingletonGetter(ttapp.api.API);
