goog.provide('ttapp.gui.animation');

goog.require('goog.style');

/**
 * @public
 * @enum {string}
 */
ttapp.gui.animation.Transition = {
	EASE:	'ease'
};

/**
 * @private
 * @enum {string}
 */
ttapp.gui.animation.TransitionTarget = {
	ALL:			'all',
	TRANSLATE:		'translate'
};

/**
 * @typedef {{
 *		x: !number,
 *		y: !number,
 *		duration: !number,
 *		transition: !ttapp.gui.animation.Transition
 * }}
 * @private
 */
ttapp.gui.animation._TranslateAnimation;

/**
 * Sets the transition
 * 
 * @private
 * @param {!Element} elem
 * @param {!ttapp.gui.animation.TransitionTarget} target,
 * @param {!number} duration,
 * @param {!ttapp.gui.animation.Transition} type
 */
ttapp.gui.animation._setTransition = function(elem, target, duration, type) {
	var value = target + " " + duration + "ms " + type;
	
	console.log(elem, value);
}

/**
 * Moves an object to the given position.
 * 
 * @public
 * @param {!Element} elem
 * @param {?ttapp.gui.animation._TranslateAnimation} params
 * @params {?Function} callback
 */
ttapp.gui.animation._translate = function(elem, params, callback) {
	if (params == null) {
		params = {
			x: 0,
			y: 0,
			duration: 0,
			transition: ttapp.gui.animation.Transition.EASE
		};
	}
	
	ttapp.gui.animation._setTransition(ttapp.gui.animation.TransitionTarget.TRANSLATE,
		params.duration, params.transition);
	goog.style.setPosition(elem, params.x, params.y);
}

/**
 * @typedef {{
 * 		func:		!function(!Element, ?Object, ?Function)
 * 		data:		?Object
 * }}
 */
ttapp.gui.animation._AnimationRecord;

/**
 * @public
 * @constructor
 * @param {!Element} node The element to animate.
 */
ttapp.gui.animation.Animator = function(node) {
	
	/**
	 * @private
	 * @type {!Element}
	 */
	this.node_ = node;
	
	/**
	 * @private
	 * @type {Array<!ttapp.gui.animation._AnimationRecord>}
	 */
	this.queue_ = [];
	
	/**
	 * @private
	 * @type {!boolean}
	 */
	this.isActive_ = false;
	
}

/**
 * @public
 * @param {!function(!Element, ?Object, ?Function)} func
 * @param {?Object=} opt_data
 */
ttapp.gui.animation.Animator.prototype.addAnimation = function(func, opt_data) {
	if (!goog.isDef(opt_data)) {
		opt_data = null;
	}
	
	this.queue_.push({
		func:		func,
		data:		opt_data
	});
	
	if (!this.isActive_) {
		this._runAnimation();
	}
}

/**
 * @private
 */
ttapp.gui.animation.Animator.prototype._runAnimation = function() {
	if (this.queue_.length > 0) {
		this.isActive_ = true;

		/**
		 * @type {ttapp.gui.animation._AnimationRecord}
		 */
		var animation = this.queue_.shift();
	
	
		// TODO
	}
}
