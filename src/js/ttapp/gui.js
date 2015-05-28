goog.provide('ttapp.gui');

goog.require('soy');
goog.require('goog.dom');


/**
 * @public
 * @param {Function} tpl
 * @param {Object.<string, *>=} data
 * @return {!Element}
 */
ttapp.gui.createElementFromTemplate = function(tpl, data) {
	var fragment = soy.renderAsFragment(tpl, data);
	
	return goog.dom.getFirstElementChild(fragment);
}


/**
 * @constructor
 * @param {Element=} node
 * @param {Function=} tpl
 * @param {Object.<string, *>=} tplData
 */
ttapp.gui.Component = function(node, tpl, tplData) {
	
	if (!node) {
		node = this._createRootNode(tpl, tplData);
	}
	this._setRootNode(node);
}

/**
 * @private
 * @type {Element}
 */
ttapp.gui.Component.prototype.rootNode_;


/**
 * @private
 * @param {Function=} tpl
 * @param {?Object.<string, *>=} data
 * @return {!Element}
 */
ttapp.gui.Component.prototype._createRootNode = function(tpl, data) {
	if (goog.isDefAndNotNull(tpl)) {
		return ttapp.gui.createElementFromTemplate(tpl, data);
	} else {
		return goog.dom.createElement(goog.dom.TagName.DIV);
	}
}

/**
 * Returns the root node of this component.
 * 
 * @public
 * @return {Element} The root node.
 */
ttapp.gui.Component.prototype.getRoot = function() {
	return this.rootNode_;
}

/**
 * Sets the root node of this component.
 * 
 * @protected
 * @param {!Element} node The new root node.
 */
ttapp.gui.Component.prototype._setRootNode = function(node) {
	this.rootNode_ = node;
	this._initForRootNode(node);
}

/**
 * Initializes all sub fields for this root node.
 * 
 * @protected
 * @param {!Element} node The root node.
 */
ttapp.gui.Component.prototype._initForRootNode = function(node) {
};


/**
 * Appends this component to a given parent node.
 * 
 * @public
 * @param {!Element} parentNode The new parent node.
 */
ttapp.gui.Component.prototype.appendTo = function(parentNode) {
	goog.dom.appendChild(parentNode, this.rootNode_);
};
