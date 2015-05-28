goog.provide('ttapp.gui.splashscreen');

goog.require('goog.dom');
goog.require('goog.events');

goog.require('ttapp.base');
goog.require('ttapp.gui');
goog.require('ttapp.progress');


/**
 * @constructor
 * @param {Element=} node
 * @extends {ttapp.gui.Component}
 */
ttapp.gui.Splashscreen = function(node) {
	ttapp.gui.Splashscreen.base(this, 'constructor', node);
}
goog.inherits(ttapp.gui.Splashscreen, ttapp.gui.Component);

/**
 * @private
 * @const
 * @enum {string}
 */
ttapp.gui.Splashscreen.Classes = {
	HIDE_SPLASH: "hiddenSplash"
};

/**
 * @private
 * @const {number}
 */
ttapp.gui.Splashscreen.DEFAULT_DELAY = 500;

/**
 * @private
 * @type {!Element}
 */
ttapp.gui.Splashscreen.prototype.progressBar_;


/**
 * Initializes all sub fields for this root node.
 * 
 * @protected
 * @param {!Element} node The root node.
 */
ttapp.gui.Splashscreen.prototype._initForRootNode = function(node) {
	ttapp.gui.Splashscreen.base(this, '_initForRootNode', node);
	
	var footer = goog.dom.getElementsByTagNameAndClass(goog.dom.TagName.FOOTER, 
			null, node);
	if (footer.length == 0) {
		footer = goog.dom.createElement(goog.dom.TagName.FOOTER);
		goog.dom.appendChild(node, footer);
	} else {
		footer = footer[0];
	}
	
	var progress = goog.dom.getElementsByTagNameAndClass(goog.dom.TagName.PROGRESS,
			null, footer);
	if (progress.length == 0) {
		progress = goog.dom.createElement(goog.dom.TagName.PROGRESS);
		goog.dom.appendChild(footer, progress);
	} else {
		progress = progress[0];
	}
	
	this.progressBar_ = progress;
}

/**
 * @public
 * @param {!ttapp.progress.ProgressCtrl} ctrl
 */
ttapp.gui.Splashscreen.prototype.registerProgressCtrl = function(ctrl) {
	var gui = this;
	var onProgress = function() {
		gui.updateByProgressCtrl(ctrl.getRelativeProgress() * 100.0);
	};
	var onProgressFinish = function() {
		gui.updateByProgressCtrl(100.0);
	}
	this.progressBar_.setAttribute('max', 100);
	
	goog.events.listen(ctrl, ttapp.progress.EventType.START, onProgress);
	goog.events.listen(ctrl, ttapp.progress.EventType.PROGRESS, onProgress);
	goog.events.listen(ctrl, ttapp.progress.EventType.FINISH, onProgressFinish);
}

/**
 * @public
 * @param {!number} value
 */
ttapp.gui.Splashscreen.prototype.updateByProgressCtrl = function(value) {
	this.progressBar_.setAttribute('value', value);
}

/**
 * @public
 * @param {number=} delay The delay for the hiding progress.
 */
ttapp.gui.Splashscreen.prototype.hideAndFree = function(delay) {
	var root = this.getRoot();
	delay = delay || ttapp.gui.Splashscreen.DEFAULT_DELAY;
	
	root.classList.add(goog.getCssName("transition-fade"));
	root.classList.add(goog.getCssName("transparent"));
	
	var removeFromDom = function() {
		goog.dom.removeNode(root);
	}
	setTimeout(removeFromDom, delay);
}
