/**
 * @fileoverview This file provides the methods and objects for the
 *	data transfer encryption.
 * @author Kilian Lütkemeyer <kilian@luetkemeyer.com>
 */
goog.provide('ttapp.api.encryption');


goog.require('ttapp.Config');

/**
 * @enum {number}
 * @private
 */
ttapp.api.encryption.Codes = {
	PLAIN: 1
};

/**
 * @typedef {function(!string): !string}
 */
ttapp.api.encryption.CryptFunction;

/**
 * @typedef {{
 * 		method:	!number,
 *  	encrypt: !ttapp.api.encryption.CryptFunction,
 * 		decrypt: !ttapp.api.encryption.CryptFunction
 * }}
 */
ttapp.api.encryption.Encryption;

/**
 * @private
 * @param {!string} data
 * @return {!string} data
 */
ttapp.api.encryption.plainCrypt = function(data) {
	return data;
};

/**
 * @public
 * @const {ttapp.api.encryption.Encryption}
 */
ttapp.api.encryption.Plain = {
	method: ttapp.api.encryption.Codes.PLAIN,
	encrypt: ttapp.api.encryption.plainCrypt,
	decrypt: ttapp.api.encryption.plainCrypt
};
