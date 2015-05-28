goog.provide('ttapp.api.imprint');

goog.require('ttapp.api.API');


/**
 * @public
 * @typedef {{
 * 		title: 		!string,
 * 		text:		!string
 * }}
 */
ttapp.api.imprint.Disclaimer;

/**
 * @public
 * @typedef {{
 * 		personId:	?number,
 * 		name:		!string,
 * 		mail:		?string
 * }}
 */
ttapp.api.imprint.Person;

/**
 * @public
 * @typedef {{
 * 		roleId:		?number,
 * 		label:		!string,
 * 		persons:	!Array<!ttapp.api.imprint.Person>
 * }}
 */
ttapp.api.imprint.Role;

/**
 * @private
 * @typedef {{
 * 		roles:		!Array<!ttapp.api.imprint.Role>,
 * 		disclaimers:!Array<!ttapp.api.imprint.Disclaimer>
 * }}
 */
ttapp.api.imprint._ImprintData;


/**
 * @private
 * @enum {string}
 */
ttapp.api.imprint.Command = {
	GetImprint: "imprint"
};

/**
 * @private
 * @enum {string}
 */
ttapp.api.imprint.JsonKeys = {
	ContactList: 'contacts',
	RoleId: 'roleId',
	Role: 'role',
	PersonList: 'persons',
	PersonId: 'personId',
	PersonName: 'name',
	PersonMail: 'mail',
	
	DisclaimerList: 'disclaimers',
	DisclaimerTitle: 'title',
	DisclaimerText: 'text'
};

/**
 * @private
 * @enum {number}
 */
ttapp.api.imprint.StatusCode = {
	OK:	200
};

/**
 * @public
 * @constructor
 * @param {!ttapp.api.API} api
 */
ttapp.api.imprint.API = function(api) {
	
	/**
	 * @private
	 * @type {!ttapp.api.API}
	 */
	this.api_ = api;
}

/**
 * @public
 * @param {function(?Array<!ttapp.api.imprint.Role>, ?Array<!ttapp.api.imprint.Disclaimer>)} callback
 */
ttapp.api.imprint.API.prototype.loadImprint = function(callback) {
	
	/** @type {!ttapp.api.imprint.API} */
	var api = this;
	
	/**
	 * @param {!number} status
	 * @param {*} data
	 */
	var onResponse = function(status, data) {
		
		/** @type {?ttapp.api.imprint._ImprintData} */
		var typedData = null;
		
		if (status == 200 && goog.isObject(data)) {
			var Keys = ttapp.api.imprint.JsonKeys;
			typedData = {
				roles:			ttapp.api.imprint.API._parseRoleList(data[Keys.ContactList]),
				disclaimers:	ttapp.api.imprint.API._parseDisclaimerList(data[Keys.DisclaimerList])
			};
		};
		
		if (typedData == null) {
			callback(null, null);
		} else {
			callback(typedData.roles, typedData.disclaimers);
		}
	}
	
	this.api_.addRequest(ttapp.api.imprint.Command.GetImprint, null, onResponse);
}

/**
 * @private
 * @param {*} raw
 * @return {!Array<!ttapp.api.imprint.Role>}
 */
ttapp.api.imprint.API._parseRoleList = function(raw) {
	return ttapp.parseArray(ttapp.api.imprint.API._parseRole, raw);
}

/**
 * @private
 * @param {*} raw
 * @return {?ttapp.api.imprint.Role}
 */
ttapp.api.imprint.API._parseRole = function(raw) {
	var Keys = ttapp.api.imprint.JsonKeys;
	
	/** @type {boolean} */
	var isValid = goog.isDefAndNotNull(raw)
		&& (!goog.isDef(raw[Keys.RoleId]) || goog.isNumber(raw[Keys.RoleId]))
		&& goog.isDefAndNotNull(raw[Keys.Role]) && goog.isString(raw[Keys.Role])
		&& goog.isDefAndNotNull(raw[Keys.PersonList]) && goog.isArrayLike(raw[Keys.PersonList])
		&& raw[Keys.PersonList].length > 0;
	
	var result = null;
	if (isValid) {
		var persons = ttapp.parseArray(ttapp.api.imprint.API._parseRolePerson, raw[Keys.PersonList]);
		if (persons.length > 0) {
			result = {
				roleId: goog.isDef(raw[Keys.RoleId]) ? /** @type {!number} */ (raw[Keys.RoleId]) : null,
				label: /** @type {!string} */ (raw[Keys.Role]),
				persons: persons
			};
		}
	}
	
	return result;
}

/**
 * @private
 * @param {*} raw
 * @return {?ttapp.api.imprint.Role}
 */
ttapp.api.imprint.API._parseRolePerson = function(raw) {
	var Keys = ttapp.api.imprint.JsonKeys;
	
	/** @type {boolean} */
	var isValid = goog.isDefAndNotNull(raw)
		&& goog.isDefAndNotNull(raw[Keys.PersonName]) && goog.isString(raw[Keys.PersonName]);
	
	/** @type {?ttapp.api.imprint.Role} */
	var result = null;
	if (isValid) {
		result = {
			personId: null,
			name: /** @type {!string} */ (raw[Keys.PersonName]),
			mail: null
		};
		
		var _id = raw[Keys.PersonId];
		var _mail = raw[Keys.PersonMail];
		
		if (goog.isDefAndNotNull(_id) && goog.isNumber(_id)) {
			result.personId = _id;
		}
		if (goog.isDefAndNotNull(_mail) && goog.isString(_mail)) {
			result.mail = _mail;
		}
	}
		
	return result;
}


/**
 * @private
 * @param {*} raw
 * @return {!Array<!ttapp.api.imprint.Disclaimer>}
 */
ttapp.api.imprint.API._parseDisclaimerList = function(raw) {
	return ttapp.parseArray(ttapp.api.imprint.API._parseDisclaimer, raw);
}

/**
 * @private
 * @param {*} raw
 * @return {?ttapp.api.imprint.Disclaimer}
 */
ttapp.api.imprint.API._parseDisclaimer = function(raw) {
	var Keys = ttapp.api.imprint.JsonKeys;
	var isValid = goog.isDefAndNotNull(raw)
		&& goog.isString(raw[Keys.DisclaimerTitle])
		&& goog.isString(raw[Keys.DisclaimerText]);
		
	if (isValid) {
		return {
			title:	/** @typedef {!string} */ (raw[Keys.DisclaimerTitle]),
			text: /** @typedef {!string} */ (raw[Keys.DisclaimerText])
		};
	} else {
		return null;
	}
}

