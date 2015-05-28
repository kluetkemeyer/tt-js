goog.provide('ttapp.progress');

goog.require('goog.events');


/**
 * @public
 * @enum {string}
 */
ttapp.progress.EventType = {
	START:			'START',
	FINISH:			'FINISH',
	PROGRESS:		'PROGRESS',
	
	START_PROGRESS:	'STARTP',
	FINISH_PROGRESS:'FINISHP'
}

/**
 * @typedef {{
 * 		maxValue:		number,
 * 		currentValue:	number,
 * 		label:			?string,
 * 		active:			boolean
 * }}
 * @private
 */
ttapp.progress.ProgressState;

/**
 * @typedef {{
 * 		progress:		function(number, string=),
 * 		finish:			function()
 * }}
 * @public
 */
ttapp.progress.ProgressHandler;

/**
 * @typedef {{
 * 		getMaxValue:	function(): number,
 * 		getValue:		function(): number,
 * 		getRelValue:	function(): number,
 * 		getLabel:		function(): string?
 * }}
 */
ttapp.progress.ProgressInformation;




/**
 * @constructor
 * @extends {goog.events.EventTarget}
 */
ttapp.progress.ProgressCtrl = function() {
	ttapp.progress.ProgressCtrl.base(this, 'constructor');
}
goog.inherits(ttapp.progress.ProgressCtrl, goog.events.EventTarget);

/**
 * @private
 * @type {{value: number, max: number, count: number}}
 */
ttapp.progress.ProgressCtrl.prototype._progress = {
	value: 0,
	max: 0,
	count: 0
};


/**
 * Starts a new created progress and returns the handler for this 
 * progress.
 * 
 * @public
 * @param {number=} opt_maxValue The maximum value to reach with this
 * 		progress. If not given the maximum value will be 100.0.
 * @param {string=} opt_label The label of the initial progress state.
 * @return {ttapp.progress.ProgressHandler}
 */
ttapp.progress.ProgressCtrl.prototype.startProgress = function(opt_maxValue, opt_label) {
	/** @type {ttapp.progress.ProgressState} */
	var progress = {
		maxValue:			opt_maxValue || 1.0,
		currentValue:		0.0,
		label:				/** @type {?string} */ (opt_label || null),
		active:				true
	}
	
	/** @type {ttapp.progress.ProgressInformation} */
	var progressInfo = {
		getMaxValue:		function() {
								return progress.maxValue;
							},
		getValue:			function() {
								return progress.currentValue;
							},
		getRelValue:		function() {
								return progress.currentValue / progress.maxValue;
							},
		getLabel:			function() {
								return progress.label;
							}
	};
	
	var ctrl = this;
	var progressHandler = {
		progress:			function(value, opt_label) {
								if (progress.active) {
									ctrl._progress.value += value - progress.currentValue;
								}
								progress.currentValue = value;
								if (goog.isDef(opt_label)) {
									progress.label = opt_label;
								}
								ctrl.fireListeners(ttapp.progress.EventType.PROGRESS, false, {control: ctrl, progress: progressInfo});
							},
		finish:				function() {
								if (progress.active) {
									ctrl._progress.value -= progress.currentValue;
									ctrl._progress.max -= progress.maxValue;
									ctrl._progress.count--;
									
									progress.active = false;
								
									ctrl.fireListeners(ttapp.progress.EventType.FINISH_PROGRESS, false, progressInfo);
									if (ctrl._progress.count == 0) {
										ctrl.fireListeners(ttapp.progress.EventType.FINISH, false, ctrl);
									}
								}
							}
	};
								
	
	var startedAll = this._progress.count == 0;
	this._progress.max += progress.maxValue;
	this._progress.count++;
	
	if (startedAll) {
		this.fireListeners(ttapp.progress.EventType.START, false, this);
	}
	this.fireListeners(ttapp.progress.EventType.START_PROGRESS, false, progressInfo);
	
	return progressHandler;
};

/**
 * @return {!number}
 * @public
 */
ttapp.progress.ProgressCtrl.prototype.getRelativeProgress = function() {
	var total = this._progress.max;
	return (total > 0.0) ? (this._progress.value / total) : 0.0;
}
