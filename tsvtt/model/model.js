/**
 * @copyright Kilian Lütkemeyer <kilian@luetkemeyer.com>
 */
 
goog.provide('tsvtt.model.AbstractModel');
goog.provide('tsvtt.model.AbstractModelSaveRequest');

goog.require('tsvtt.utils.extend');
goog.require('tsvtt.api.Request');
goog.require('tsvtt.api.RequestMethod');

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

tsvtt.model.AbstractModel.prototype.hasUnsavedData = function() {
	for (propName in this.newData_) {
		if (this.newData_.hasOwnProperty(propName)) {
			return true;
		}
	}
	return false;
}

tsvtt.model.AbstractModel.prototype.populate = function(data) {
	var undefined;
	if (data == undefined) 
		return;
		
	for(propName in this.savedData_) {
		if (data.hasOwnProperty(propName)) {
			this.newData_[propName] = data;
		}
	}
}


tsvtt.model.AbstractModelSaveRequest = function(model) {
	goog.base(this, tsvtt.api.RequestMethod.PUT);
	this.model_ = model;
};

tsvtt.model.AbstractModelSaveRequest.prototype.model_;

tsvtt.model.AbstractModelSaveRequest.prototype._onSaved = function(savedData) {
	for(propName in savedData) {
		if (savedData.hasOwnProperty(propName) && this.model_.savedData_.hasOwnPrototype(propName)) {
			this.model_.savedData_[propName] = savedData[propName];
			
			if (this.model_.newData_.hasOwnProperty(propName)) {
				delete this.model_.newData_[propName];
			}
		}
	}
}

goog.inherits(tsvtt.model.AbstractModel.SaveRequest, tsvtt.model.Request);

