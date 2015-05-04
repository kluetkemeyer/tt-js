goog.provide("ttapp.debug");

goog.require("ttapp.Config");


if (ttapp.Config.DEBUG) {
	
	/**
	 * Checks, whether a given value matches a filter.
	 * 
	 * A filter can be build in three different ways.
	 * First one is as simple boolean. If the filter is a boolean, all
	 * values are accepted (for true as filter value) or rejected (for
	 * false as filter value).
	 * If the filter is an array of strings the value is accepted, if it
	 * is part of the list.
	 * If the filter is one simple string, the value is accpeted, if it
	 * is exactly the same as the filter.
	 * 
	 * @param {string} value The value to check.
	 * @param {(boolean|string|Array<String>)} The filter to match the
	 * 		value against.
	 * @return {boolean} True, if the value is accepted; otherwise 
	 * 		false.
	 */
	ttapp.debug._filter = function(value, filter) {
		if (typeof filter == "boolean") {
			return filter;
		}
	}
		
	
	/**
	 * @param {string} debuglevel The debug level of the output.
	 * @param {string} module The module of the output.
	 * @param {...*} args Any additional variable to dump as log output.
	 * @private
	 */
	ttapp.debug._log = function(debuglevel, module) {
		if (ttapp.debug._filter(debuglevel, ttapp.Config.DEBUG_LEVEL)
			&& ttapp.debug._filter(module, ttapp.Config.DEBUG_MODULE))
		{
			var func = console.log;
			if (debuglevel == "error" || debuglevel == "fatal") {
				func = console.error;
			}
			
			var msg = "[" + debuglevel + " - " + module + "]";
			var args = [msg];
			for(var i=2; i<arguments.length; ++i) {
				args.push(arguments[i]);
			}
			
			func.apply(console, args);
		}
	};
	
	/**
	 * @param {string} val The debug level, the error function should
	 * 		produce.
	 * @private
	 */
	ttapp.debug.errorfunc = function(val) {
		return function() {
			var args = [val];
			for(var i=0; i<arguments.length; ++i) {
				args.push(arguments[i]);
			}
			
			ttapp.debug._log.apply(null, args);
		};
	}
	
	/**
	 * @param {string} module The name of the module, the log command
	 * 		was called from.
	 * @param {...*} args Any additional variable to dump as log output.
	 */
	ttapp.debug.log = ttapp.debug.errorfunc("log");
	
	/**
	 * @param {string} module The name of the module, the log command
	 * 		was called from.
	 * @param {...*} args Any additional variable to dump as log output.
	 */
	ttapp.debug.err = ttapp.debug.errorfunc("error");
	
	/**
	 * @param {string} module The name of the module, the log command
	 * 		was called from.
	 * @param {...*} args Any additional variable to dump as log output.
	 */
	ttapp.debug.debug = ttapp.debug.errorfunc("debug");
	
	
} else {
	
	ttapp.debug.log = function() {};
	
}
