goog.provide('ttapp.base');


ttapp.proxy = function(func, context) {
	return function() {
		func.apply(context, arguments);
	};
};
