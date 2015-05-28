goog.provide('ttapp.gui.progress');

goog.require('goog.dom.classlist');
goog.require('goog.events');

goog.require('ttapp.base');
goog.require('ttapp.api.API');
goog.require('ttapp.gui');
goog.require('ttapp.gui.tpl.progress');

/**
 * @public
 * @constructor
 * @extends {ttapp.gui.Component}
 */
ttapp.gui.progress.apiloader = function() {
	ttapp.gui.progress.apiloader.base(this, 'constructor', undefined,
		ttapp.gui.tpl.progress.apiloader);
}
goog.inherits(ttapp.gui.progress.apiloader,
	ttapp.gui.Component);
	
/**
 * @private
 * @type {!boolean}
 */
ttapp.gui.progress.apiloader.prototype.visible_ = false;

/**
 * @private
 * @const {number}
 */
ttapp.gui.progress.apiloader.DETACH_DELAY = 200;

/**
 * @public
 * @param {!boolean} isVisible
 */
ttapp.gui.progress.apiloader.prototype.setVisible = function(isVisible) {
	if (this.visible_ != isVisible) {
		this.visible_ = isVisible;
		var root = this.getRoot();
		
		var clsHidden = goog.getCssName('apiloader-wrapper-hidden');
		var clsDetached = goog.getCssName('apiloader-wrapper-detached');
		
		if (isVisible) {
			goog.dom.classlist.removeAll(root, [clsHidden, clsDetached]);
		} else {
			var apiloader = this;
			goog.dom.classlist.add(root, clsHidden);
			setTimeout(function() {
				if (!apiloader.visible_) {
					goog.dom.classlist.add(root, clsDetached);
				}
			}, ttapp.gui.progress.apiloader.DETACH_DELAY);
		}
	}
}


/**
 * @public
 * @param {ttapp.api.API} api
 */
ttapp.gui.progress.apiloader.prototype.registerForAPI = function(api) {
	goog.events.listen(api, ttapp.api.APIEventType.START, ttapp.proxy(this._show, this));
	goog.events.listen(api, ttapp.api.APIEventType.FINISH, ttapp.proxy(this._hide, this));
}

/**
 * @private
 */
ttapp.gui.progress.apiloader.prototype._show = function() {
	this.setVisible(true);
}

/**
 * @private
 */
ttapp.gui.progress.apiloader.prototype._hide = function() {
	this.setVisible(false);
}

