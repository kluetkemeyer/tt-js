/**
 * @copyright Kilian Lütkemeyer <kilian@luetkemeyer.com>
 */

goog.provide('tsvtt.model.Player');

goog.require('tsvtt.model._PersonExtension');


tsvtt.model.Player = function(p_person, p_data) {
	goog.base(this, p_person, {}, p_data);
}



goog.inherits(tsvtt.model.Player, tsvtt.model._PersonExtension);