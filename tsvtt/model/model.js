/**
 * @copyright Kilian Lütkemeyer <kilian@luetkemeyer.com>
 */
 
goog.provide('tsvtt.model.AbstractModel');

goog.require('tsvtt.utils.extend');

/**
 * Creates a new basic model.
 */
tsvtt.model.AbstractModel = function(rawData, p_data) {
	var undefined;
	if (rawData == undefined) rawData = {};
	rawData = tsvtt.utils.extend(rawData, p_data);
	
	this.savedData_ = rawData;
	this.newData_ = {};
}

tsvtt.model.AbstractModel.prototype.savedData_;

tsvtt.model.AbstractModel.prototype.newData_;
