goog.provide('ttapp.api.press');

goog.require('ttapp.api.API');

/**
 * @public
 * @typedef {{
 *		archiveId:		!number,
 *		label:			!string
 * }}
 */
ttapp.api.press.ArchiveModel;

/**
 * @public
 * @typedef {{
 * 		archives:		Array<!ttapp.api.press.ArchiveModel>
 * }}
 */
ttapp.api.press.CategoriesModel;

/**
 * @private
 * @enum {string}
 */
ttapp.api.press.Command = {
	GetCategories: "press/categories"
};

/**
 * @private
 * @enum {string}
 */
ttapp.api.press.JsonKeys = {
	Archive: 'archive',
	ArchiveId: 'id',
	Label: 'title'
};

/**
 * @private
 * @enum {number}
 */
ttapp.api.press.StatusCode = {
	OK:	200
};

/**
 * @public
 * @constructor
 * @param {!ttapp.api.API} api
 */
ttapp.api.press.API = function(api) {
	
	/**
	 * @private
	 * @type {!ttapp.api.API}
	 */
	this.api_ = api;
}

/**
 * @public
 * @param {function(ttapp.api.press.CategoriesModel)} callback
 */
ttapp.api.press.API.prototype.getCategories = function(callback) {
	var self = this;
	
	var StatusCode = ttapp.api.press.StatusCode;
	var onData = function(status, data) {
		var result = self._parseCategories(status == StatusCode.OK
				? data : null);
		callback(result);
	};
	this.api_.addRequest(ttapp.api.press.Command.GetCategories, null, onData);
};

/**
 * @private
 * @param {*=} opt_data
 * @return {ttapp.api.press.CategoriesModel}
 */
ttapp.api.press.API.prototype._parseCategories = function(opt_data) {
	var result = {
		archives: []
	};	
	
	if (goog.isObject(opt_data)) {
		var JsonKeys = ttapp.api.press.JsonKeys;
		
		result.archives = this._parseArchives(opt_data[JsonKeys.Archive]);
	}
	
	return result;
};

/**
 * @private
 * @param {*=} opt_data
 * @return {Array<ttapp.api.press.ArchiveModel>}
 */
ttapp.api.press.API.prototype._parseArchives = function(opt_data) {
	var result = [];
	
	if (goog.isArrayLike(opt_data)) {
		var self = this;
		goog.array.forEach(/** @type {{length: !number}} */ (opt_data), function(item) {
			result.push(self._parseArchive(item));
		});
	}
	
	return result;
};


/**
 * @private
 * @param {*=} opt_data
 * @return {ttapp.api.press.ArchiveModel}
 */
ttapp.api.press.API.prototype._parseArchive = function(opt_data) {
	var isObj = goog.isObject(opt_data);
	var JsonKeys = ttapp.api.press.JsonKeys;
	
	return {
		archiveId: (isObj && goog.isNumber(opt_data[JsonKeys.ArchiveId]))
				? opt_data[JsonKeys.ArchiveId] : -1,
		label: (isObj && goog.isString(opt_data[JsonKeys.Label]))
				? opt_data[JsonKeys.Label] : 'Unknown'
	};
};
