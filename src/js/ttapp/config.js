goog.provide("ttapp.Config");


/**
 * @define {boolean}
 */
var ENABLE_DEBUG = true;

/**
 * Debug flag.
 * 
 * If this flag is set to true, the application generates debug output.
 * Otherwise all debug code is removed during code optimation.
 * 
 * @const {boolean}
 */
ttapp.Config.DEBUG = ENABLE_DEBUG;

/**
 * 
 * @const {(boolean|string|Array<string>)}
 */
ttapp.Config.DEBUG_MODULE = true;

/**
 * @const {(boolean|string|Array<string>)}
 */
ttapp.Config.DEBUG_LEVEL = true;

/**
 * @const {boolean}
 */
ttapp.Config.STORE_SESSION = true;

/**
 * @const {boolean}
 */
ttapp.Config.USE_ENCRYPTION = false;


/**
 * @const {string}
 */
ttapp.Config.API_URL = "http://www.tsv-uetersen-tt.de/api/cmd";

/**
 * @const {string}
 */
ttapp.Config.API_METHOD = "POST";
