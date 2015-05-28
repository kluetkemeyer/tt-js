goog.provide('ttapp.base');

/**
 * @public
 * @param {!Function} func
 * @param {!*} context
 * @return {!Function}
 */
ttapp.proxy = function(func, context) {
	return function() {
		func.apply(context, arguments);
	};
};

/**
 * @public
 * @param {?string} str
 * @param {!number=} opt_radix
 * @return {?number} 
 */
ttapp.stoi = function(str, opt_radix) {
	if (str === null) return str;
	try {
		var n = parseInt(str, opt_radix || 10);
		return n;
	} catch(e) {
		return null;
	}
}

/**
 * @public
 * @template T
 * @param {!function(*): ?T} objectParser
 * @param {*} data
 * @return {!Array<!T>}
 */
ttapp.parseArray = function(objectParser, data) {
	/** @typedef {!Array<!T>} */
	var result = [];
	
	if (goog.isDefAndNotNull(data) && goog.isArrayLike(data)) {
		goog.array.forEach(data, function(item) {
			/** @typedef {?T} */
			var obj = objectParser(item);
			
			if (obj != null) {
				result.push(/** @type {!T} */ obj);
			}
		});
	}
	
	return result;
};

/**
 * @public
 * @param {!Function} func
 * @param {!number} delay
 */
ttapp.timeout = setTimeout;
