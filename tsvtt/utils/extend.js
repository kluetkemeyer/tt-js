/**
 * @copyright Kilian Lütkemeyer <kilian@luetkemeyer.com>
 */
goog.provide("tsvtt.utils.extend");

tsvtt.utils.extend = function(baseRecord, data) {
	var undefined;
	if (data != undefined) {
		for (propName in baseRecord) {
			if (baseRecord.hasOwnProperty(propName) && data[propName] != undefined) {
				baseRecord[propName] = data[propName];
			}
		}
	}
	
	return baseRecord;
}