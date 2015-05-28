goog.provide('ttapp.gui.menu');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.events');

goog.require('ttapp.base');
goog.require('ttapp.gui');
goog.require('ttapp.gui.tpl.menu');

/**
 * Creates a new link for the head menu.
 * 
 * @constructor
 * @param {!string} label
 * @param {?function()} callback
 */
ttapp.gui.menu.TopMenuLink = function(label, callback) {
	this._init(label || "");
	if (callback) {
		this.setCallback(callback);
	}
}

/**
 * Holds the root node of the link.
 * 
 * @private
 * @type {Element}
 */
ttapp.gui.menu.TopMenuLink.prototype.rootNode_;

/**
 * Holds the link node.
 * 
 * @private
 * @type {Element}
 */
ttapp.gui.menu.TopMenuLink.prototype.linkNode_;

/**
 * Holds the callback method for clicking.
 * 
 * @private
 * @type {?function()}
 */
ttapp.gui.menu.TopMenuLink.prototype.callback_;

/**
 * Initializes the top menu link.
 * 
 * Creates the html code for the link and apply all the nodes to the
 * references within this object.
 * 
 * @private
 */
ttapp.gui.menu.TopMenuLink.prototype._init = function(label) {
	var root = /** @type {!Element} */ (soy.renderAsFragment(ttapp.gui.tpl.menu.headMenuLink,
		{label: label}));
		
		
	this.linkNode_ = goog.dom.getElementByClass(goog.getCssName('pure-menu-link'), root);
	this.rootNode_ = goog.dom.getParentElement(this.linkNode_);
	
	goog.events.listen(this.linkNode_, goog.events.EventType.CLICK,
		this._onClick, false, this);
};

/**
 * Internal callback for the click handler.
 * 
 * @param {goog.events.Event} event The click event
 * @private
 */
ttapp.gui.menu.TopMenuLink.prototype._onClick = function(event) {
	if (this.callback_) {
		this.callback_();
	}
};

/**
 * Sets the internal callback to the given value.
 * 
 * @param {?function()} callback
 */
ttapp.gui.menu.TopMenuLink.prototype.setCallback = function(callback) {
	this.callback_ = callback;
}

/**
 * Sets the label of the link.
 * 
 * @param {string} label The new label of the string.
 */
ttapp.gui.menu.TopMenuLink.prototype.setLabel = function(label) {
	this.linkNode_.textContent = label;
}

/**
 * Appends the menu item to a given dom node.
 * 
 * @param {!Element} domNode The parent element to add this menu to.
 * @public
 */
ttapp.gui.menu.TopMenuLink.prototype.appendTo = function(domNode) {
	goog.dom.appendChild(domNode, this.rootNode_);
};

/**
 * Marks the link as active or inactive.
 * 
 * @param {boolean=} opt_isActive
 * @public
 */
ttapp.gui.menu.TopMenuLink.prototype.setActive = function(opt_isActive) {
	if (goog.isDefAndNotNull(opt_isActive) && !opt_isActive) {
		goog.dom.classlist.remove(this.rootNode_, goog.getCssName('pure-menu-selected'));
	} else {
		goog.dom.classlist.add(this.rootNode_, goog.getCssName('pure-menu-selected'));
	}
};
		

/**
 * Creates a new menu.
 * 
 * @constructor
 * @extends {ttapp.gui.Component}
 */
ttapp.gui.menu.TopMenu = function(node) {	
	ttapp.gui.menu.TopMenu.base(this, 'constructor', node, ttapp.gui.tpl.menu.headMenu);
};
goog.inherits(ttapp.gui.menu.TopMenu, ttapp.gui.Component);

/**
 * The brand node of the top menu.
 * 
 * @private
 * @type {!Element}
 */
ttapp.gui.menu.TopMenu.prototype.brand_;

/**
 * The toggle button of the top menu.
 * 
 * @private
 * @type {!Element}
 */
ttapp.gui.menu.TopMenu.prototype.toggle_;

/**
 * The root node of the tucked menu part within the top menu.
 * 
 * @private
 * @type {!Element}
 */
ttapp.gui.menu.TopMenu.prototype.tucked_;

/**
 * The root node of the list for the tucked menu part.
 * 
 * All links should be added to this node.
 * 
 * @private
 * @type {!Element}
 */
ttapp.gui.menu.TopMenu.prototype.tuckedList_;

/**
 * Flag, to indicate, wheter the tucked menu part is visible or not
 * on mobile view variant.
 * 
 * @private
 * @type {boolean}
 */
ttapp.gui.menu.TopMenu.prototype.isTucked_ = false;

/**
 * The brand callback
 * 
 * This callback is called, when the brand button is clicked. If no
 * callback is defined, nothing will be done.
 * 
 * @private
 * @type {?function()}
 */
ttapp.gui.menu.TopMenu.prototype.brandCallback_ = null;

/**
 * Initializes the menu.
 * 
 * Creates the html code and links all elements need to be linked or
 * treated with any special handling.
 * 
 * @protected
 * @param {!Element} root The root node.
 */
ttapp.gui.menu.TopMenu.prototype._initForRootNode = function(root) {	
	// inherit call
	ttapp.gui.menu.TopMenu.base(this, '_initForRootNode', root);
//	ttapp.gui.Component.prototype._initForRootNode.call(this, root);
	
	// extract nodes from fragment
	this.brand_ = /** @type {!Element} */ (goog.dom.getElementByClass(goog.getCssName('headMenu-brand'), root));
	this.toggle_ = /** @type {!Element} */ (goog.dom.getElementByClass(goog.getCssName('headMenu-toggle'), root));
	this.tucked_ = /** @type {!Element} */ (goog.dom.getElementByClass(goog.getCssName('headMenu-tucked'), root));
	this.tuckedList_ = /** @type {!Element} */ (goog.dom.getElementByClass(goog.getCssName('pure-menu-list'), root));


	// bind events 
	goog.events.listen(this.toggle_, goog.events.EventType.CLICK,
			this._onToggleTucked, false, this);
	goog.events.listen(this.brand_, goog.events.EventType.CLICK,
			this._onBrandClick, false, this);
			
	// update the state to match the toggle
	this._updateToggleState();
}

/**
 * Callback method, called on click on the toggle button.
 * 
 * @param {goog.events.Event} event
 * @private
 */
ttapp.gui.menu.TopMenu.prototype._onToggleTucked = function(event) {
	this.isTucked_ = !this.isTucked_;
	this._updateToggleState();
};

/**
 * Callback method, called on click on the brand button.
 * 
 * @param {goog.events.Event} event
 * @private
 */
ttapp.gui.menu.TopMenu.prototype._onBrandClick = function(event) {
	if (this.brandCallback_) {
		this.brandCallback_();
	}
}

/**
 * Updates the classes of the top menu.
 * 
 * The classes of the top menu are updated according to the current
 * visibility state of the tucked menu part.
 * 
 * @private
 */
ttapp.gui.menu.TopMenu.prototype._updateToggleState = function() {
	if (this.isTucked_) {
		goog.dom.classlist.add(this.toggle_, goog.getCssName('x'));
		goog.dom.classlist.remove(this.tucked_, goog.getCssName('headMenu-tucked'));
	} else {
		goog.dom.classlist.remove(this.toggle_, goog.getCssName('x'));
		goog.dom.classlist.add(this.tucked_, goog.getCssName('headMenu-tucked'));
	}
};

/**
 * Appends the menu to a given dom node.
 * 
 * @param {!Element} domNode The parent element to add this menu to.
 * @public
 */
ttapp.gui.menu.TopMenu.prototype.appendTo = function(domNode) {
	goog.dom.appendChild(domNode, this.getRoot());
};

/**
 * Sets the callback of the brand click handler.
 * 
 * @param {?function()} callback
 * @public
 */
ttapp.gui.menu.TopMenu.prototype.setBrandCallback = function(callback) {
	this.brandCallback_ = callback;
}

/**
 * Creates a new link.
 * 
 * @param {string} label The label of the link
 * @param {?function()} callback The callback method of the link
 * @return {ttapp.gui.menu.TopMenuLink}
 * @public
 */
ttapp.gui.menu.TopMenu.prototype.addLink = function(label, callback) {
	var link = new ttapp.gui.menu.TopMenuLink(label, callback);
	
	link.appendTo(this.tuckedList_);
	
	return link;
}


/**
 * @constructor
 * @public
 * @param {!string} label The label of the menu item.
 */
ttapp.gui.menu.AbstractMenuItem = function(label) {
	this.label_ = label;
}

/**
 * @protected
 * @type {!string}
 */
ttapp.gui.menu.AbstractMenuItem.prototype.label_;

/**
 * @private
 * @type {?Element}
 */
ttapp.gui.menu.AbstractMenuItem.prototype.root_;

/**
 * @public
 * @return {!Element}
 */
ttapp.gui.menu.AbstractMenuItem.prototype.getRootElement = function() {
	if (this.root_ == null) {
		this.root_ = this._createNode();
	}
	return this.root_;
}

/**
 * @protected
 * @return {!Element}
 */
ttapp.gui.menu.AbstractMenuItem.prototype._createNode = function() {
	return goog.dom.createDom(goog.dom.TagName.LI, {'class': goog.getCssName('pure-menu-item')});
}


/**
 * @constructor
 * @public
 * @param {!string} label The label for the menu item
 * @param {!Function} clickCallback The callback for clicking
 * @extends {ttapp.gui.menu.AbstractMenuItem}
 */
ttapp.gui.menu.SimpleMenuItem = function(label, clickCallback) {
	ttapp.gui.menu.SimpleMenuItem.base(this, 'constructor', label);

	/**
	 * @private
	 * @type {!Function}
	 */
	this.clickCallback_ = clickCallback;
}
goog.inherits(ttapp.gui.menu.SimpleMenuItem, ttapp.gui.menu.AbstractMenuItem);

/**
 * @protected
 * @return {!Element}
 */
ttapp.gui.menu.SimpleMenuItem.prototype._createNode = function() {
	var tpl = /** @type {Element} */ (soy.renderAsFragment(ttapp.gui.tpl.menu.headMenuLink, 
					{label: this.label_}));
	var node = goog.dom.getElementsByTagNameAndClass('li', undefined, 
			tpl)[0];
			
	var link = goog.dom.getElementsByTagNameAndClass('a', undefined, node)[0];
			
	goog.events.listen(link, goog.events.EventType.CLICK, this.clickCallback_);
	
	return node;
}

/**
 * @constructor
 * @public
 * @param {!string} label The label for the menu item
 * @extends {ttapp.gui.menu.AbstractMenuItem}
 */
ttapp.gui.menu.HeadlineMenuItem = function(label, clickCallback) {
	ttapp.gui.menu.HeadlineMenuItem.base(this, 'constructor', label);
}
goog.inherits(ttapp.gui.menu.HeadlineMenuItem, ttapp.gui.menu.AbstractMenuItem);

/**
 * @protected
 * @return {!Element}
 */
ttapp.gui.menu.HeadlineMenuItem.prototype._createNode = function() {
	var tpl = /** @type {Element} */ (soy.renderAsFragment(ttapp.gui.tpl.menu.categoryLink, 
					{label: this.label_}));
	var node = goog.dom.getElementsByTagNameAndClass('li', undefined, 
			tpl)[0];
	
	return node;
}
