/**
 * @copyright Kilian Lütkemeyer <kilian@luetkemeyer.com>
 */

goog.provide('tsvtt.model.Person');
goog.provide('tsvtt.model._PersonExtension');

goog.require('tsvtt.model.AbstractModel');

tsvtt.model.Gender = {
	MALE: 'M',
	FEMALE: 'F'
};

/**
 * Model for a person.
 *
 * A person is any human individual. This might be a player, referee, CEO, any
 * other functional person or even more of those.
 *
 * @param {obj} p_data Map with predefined property values.
 * @extends {tsvtt.model.AbstractModel}
 */
tsvtt.model.Person = function(p_data) {
	goog.base(this, {
			personId: -1,
			firstname: null,
			secondnames: [],
			lastname: null,
			birthdate: null,
			gender: null
		}, p_data);
};

tsvtt.model.Person.prototype.saveRequest() {
	
}


tsvtt.model._PersonExtension = function(p_person, raw_data, p_data) {
	goog.base(this, raw_data, p_data);
	this.person_ = p_person;
};
tsvtt.model._PersonExtension.prototype.person_;

// inherits from tsvtt.model.AbstractModel
goog.inherits(tsvtt.model.Person, tsvtt.model.AbstractModel);
goog.inherits(tsvtt.model._PersonExtension, tsvtt.model.AbstractModel);