/**
 * @fileoverview This file provides the methods and objects for the
 *	data transfer encryption.
 * @author Kilian Lütkemeyer <kilian@luetkemeyer.com>
 */
goog.provide('ttapp.api.encryption');


goog.require('ttapp.Config');

/**
 * @const {number}
 * @private
 */
ttapp.api.encryption.Codes = {
	PLAIN: 0
};

/**
 * @private
 * @param {string} data
 * @return {string} data
 */
ttapp.api.encryption.plainCrypt = function(data) {
	return data;
};

/**
 * @public
 * @type {Object}
 */
ttapp.api.encryption.Plain = {
	id: ttapp.api.encryption.Codes.PLAIN,
	encrypt: ttapp.api.encryption.plainCrypt,
	decrypt: ttapp.api.encryption.plainCrypt
};
