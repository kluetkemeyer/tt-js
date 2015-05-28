goog.provide('ttapp.api.competition');

goog.require('ttapp.api.API');

/**
 * @public
 * @typedef {{
 * 		competitionId:		!number,
 * 		label:				!string,
 * 		accessLevel:		!string
 * }}
 */
ttapp.api.competition.CompetitionModel;

/**
 * @private
 * @enum {string}
 */
ttapp.api.competition.Command = {
	GetActiveCompetitions: "competition/active"
};

/**
 * @private
 * @enum {string}
 */
ttapp.api.competition.JsonKeys = {
	Competition: 'competition',
	CompetitionId: 'id',
	Label: 'title',
	AccessLevel: 'access'
};

/**
 * @public
 * @enum {string}
 */
ttapp.api.competition.AccessLevel = {
	Deny:			'DENY',
	ReadOnly:		'READ',
	Report:			'REPORT',
	Edit:			'EDIT',
	Administrate:	'ADMIN'
};

/**
 * @private
 * @enum {number}
 */
ttapp.api.competition.StatusCode = {
	OK:	200
};

/**
 * @public
 * @constructor
 * @param {!ttapp.api.API} api
 */
ttapp.api.competition.API = function(api) {
	
	/**
	 * @private
	 * @type {!ttapp.api.API}
	 */
	this.api_ = api;
}

/**
 * @public
 * @param {function(!Array<!ttapp.api.competition.CompetitionModel>, !string)} callback
 */
ttapp.api.competition.API.prototype.getActiveCompetitions = function(callback) {
	var self = this;
	
	var StatusCode = ttapp.api.competition.StatusCode;
	var JsonKeys = ttapp.api.competition.JsonKeys;
	
	var onData = function(status, data) {
		/** @type {!Array<!ttapp.api.competition.CompetitionModel>} */
		var result = [];
		
		/** @type {!string} */
		var access = ttapp.api.competition.AccessLevel.ReadOnly;
		
		if (status == StatusCode.OK && goog.isObject(data)) {
			if (goog.isString(data[JsonKeys.AccessLevel])) {
				access = data[JsonKeys.AccessLevel];
			}
			if (goog.isArrayLike(data[JsonKeys.Competition])) {
				var arrData = /** @type{!Array<*>} */ (data[JsonKeys.Competition]);
				result = self._parseCompetitions(arrData);
			}
		}
		callback(result, access);
	};
	this.api_.addRequest(ttapp.api.competition.Command.GetActiveCompetitions, null, onData);
};

/**
 * @private
 * @param {!Array<*>} data
 * @return {!Array<!ttapp.api.competition.CompetitionModel}
 */
ttapp.api.competition.API.prototype._parseCompetitions = function(data) {
	/** @type {Array<!ttapp.api.competition.CompetitionModel} */
	var result = [];	
	
	/** @type {ttapp.api.competition.API} */
	var self = this;
	
	goog.array.forEach(data, function(item) {
		result.push(self._parseCompetition(item));
	});
	
	return result;
};

/**
 * @private
 * @param {*=} opt_data
 * @return {!ttapp.api.competition.CompetitionModel}
 */
ttapp.api.competition.API.prototype._parseCompetition = function(opt_data) {
	/** @type {!ttapp.api.competition.CompetitionModel} */
	var result = {
		competitionId: -1,
		label: '',
		accessLevel: ttapp.api.competition.AccessLevel.Deny
	};
	
	if (goog.isObject(opt_data)) {
		var JsonKeys = ttapp.api.competition.JsonKeys;
		if (goog.isNumber(opt_data[JsonKeys.CompetitionId])) {
			result.competitionId = /** @type {!number} */ (opt_data[JsonKeys.CompetitionId]);
		}
		if (goog.isString(opt_data[JsonKeys.Label])) {
			result.label = /** @type {!string} */ (opt_data[JsonKeys.Label]);
		}
		if (goog.isString(opt_data[JsonKeys.AccessLevel])) {
			result.accessLevel = /** @type {!string} */ (opt_data[JsonKeys.AccessLevel]);
		}
	}
	
	return result;
};
