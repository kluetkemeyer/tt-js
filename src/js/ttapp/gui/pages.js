goog.provide('ttapp.gui.pages');

goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.events');

goog.require('ttapp.base');
goog.require('ttapp.gui');
goog.require('ttapp.gui.animation');
goog.require('ttapp.gui.menu');
goog.require('ttapp.gui.tpl.pages');


/**
 * @enum {string}
 * @public
 */
ttapp.gui.pages.EventType = {
	PAGE_SHOW:		"SHOW_PAGE",
	PAGE_HIDE:		"HIDE_PAGE",
	
	PAGEGROUP_SHOW:	"SHOW_PAGEGROUP",
	PAGEGROUP_HIDE: "HIDE_PAGEGROUP"
};

/**
 * @const {string}
 */
ttapp.gui.pages.MODULE = "pages";


/**
 * @constructor
 * @param {Element=} node The node to parse as page container.
 * @extends {ttapp.gui.Component}
 */
ttapp.gui.pages.PageContainer = function(node) {
	ttapp.gui.pages.PageContainer.base(this, 'constructor', node, ttapp.gui.tpl.pages.pageContainer);
}
goog.inherits(ttapp.gui.pages.PageContainer, ttapp.gui.Component);

/**
 * @private
 * @type {Element}
 */
ttapp.gui.pages.PageContainer.prototype.rootNode_;

/**
 * @public
 * @type {!ttapp.gui.menu.TopMenu}
 */
ttapp.gui.pages.PageContainer.prototype.headmenu;

/**
 * @private
 * @type {!Element}
 */
ttapp.gui.pages.PageContainer.prototype.sidemenu;

/**
 * @private
 * @type {?ttapp.gui.pages.PageGroup}
 */
ttapp.gui.pages.PageContainer.prototype.pageGroup_active = null;

/**
 * @private
 * @type {?ttapp.gui.pages.PageGroup}
 */
ttapp.gui.pages.PageContainer.prototype.pageGroup_loading = null;


/**
 * Initializes all sub fields for this root node.
 * 
 * @protected
 * @param {!Element} node The root node.
 */
ttapp.gui.pages.PageContainer.prototype._initForRootNode = function(node) {
	ttapp.gui.Component.prototype._initForRootNode.call(this, node);
	
	var searchNode;
	
	
	searchNode = goog.dom.getElementByClass(goog.getCssName('headMenu-wrapper'), node);
	this.headmenu = new ttapp.gui.menu.TopMenu(searchNode);
	
	searchNode = goog.dom.getElementByClass(goog.getCssName('sideMenu'), node);
	this.sidemenu = /** @type {!Element} */ (goog.dom.getElementByClass(goog.getCssName('pure-menu-list'), searchNode));	
	
	
	
	var layoutNode		= goog.dom.getElementsByTagNameAndClass(undefined, goog.getCssName('ui-mainframe'), node)[0];
	var menuNode		= goog.dom.getElementsByTagNameAndClass(undefined, goog.getCssName('ui-sidebar'), node)[0];
	var menuLinkNode	= goog.dom.getElementsByTagNameAndClass(undefined, goog.getCssName('ui-sidebar-link'), node)[0];
	
	this.contentContainer_ = goog.dom.getElementsByTagNameAndClass(undefined, goog.getCssName('ui-contentframe'), node)[0];
	
	
	goog.events.listen(menuLinkNode, goog.events.EventType.CLICK, function() {
		var css_class = goog.getCssName('active');
		
		goog.dom.classlist.toggle(layoutNode, css_class);
		goog.dom.classlist.toggle(menuNode, css_class);
		goog.dom.classlist.toggle(menuLinkNode, css_class);
	});
}

/**
 * @public
 * @param {boolean} isVisible
 */
ttapp.gui.pages.PageContainer.prototype.setVisible = function(isVisible) {
	var className = goog.getCssName('hidden');
	var classList = this.getRoot().classList;
	
	if (isVisible) {
		classList.remove(className);
	} else {
		classList.add(className);
	}
}

/**
 * @public
 */
ttapp.gui.pages.PageContainer.prototype.setAsMainContainer = function() {
	ttapp.gui.pages.PageGroup.setContainer(this);
}

/**
 * @private
 * 
 * @param {!ttapp.gui.pages.PageGroup} pageGroup
 * @param {Array<ttapp.gui.menu.AbstractMenuItem>} menu_items
 */
ttapp.gui.pages.PageContainer.prototype._setActive = function(pageGroup, menu_items) {
	this.pageGroup_active = pageGroup;
	
	goog.events.dispatchEvent(pageGroup, ttapp.gui.pages.EventType.PAGEGROUP_SHOW);
	this._showMenu(menu_items);
}
	

/**
 * @private
 * 
 * @param {!ttapp.gui.pages.PageGroup} pageGroup
 */
ttapp.gui.pages.PageContainer.prototype.showPageGroup = function(pageGroup) {
	if ((this.pageGroup_active == pageGroup && this.pageGroup_loading == null) || this.pageGroup_loading == pageGroup) {
		return;
	}
	
	var pc = this;
	/**
	 * @type {{
	 * 	clearedMenu: !boolean,
	 *  clearedContent: !boolean,
	 *  menu: !(boolean|Array<ttapp.gui.menu.AbstractMenuItem>),
	 *  content: ?(boolean|ttapp.gui.pages.ContentPage)
	 * }}
	 */
	var state = {
		clearedMenu: false,
		clearedContent: false,
		menu: false,
		content: false
	};	
	var onFinished = function() {
		var f = false;
		if (state.clearedMenu !== f && state.clearedContent !== f && state.menu !== f && state.content !== f  && pc.pageGroup_loading == pageGroup) {
			pc._setActive(pageGroup, /** @type {Array<ttapp.gui.menu.AbstractMenuItem>} */ (state.menu));
//			console.log(state.clearedMenu, state.menu);
			pc._showContent(state.content);
		}
	};
	
	this.pageGroup_loading = pageGroup;
	ttapp.debug.debug(ttapp.gui.pages.MODULE, 'trigger showing page group <' + pageGroup.label_ + '>');
	
	// step 1: hide active group
	ttapp.debug.debug(ttapp.gui.pages.MODULE, 'hide old content');
	var onMenuHidden = function() {
		ttapp.debug.debug(ttapp.gui.pages.MODULE, 'menu hidden');
		state.clearedMenu = true;
		onFinished();
	};
	var onContentHidden = function() {
		ttapp.debug.debug(ttapp.gui.pages.MODULE, 'content hidden');
		pc.pageGroup_active = null;
		state.clearedContent = true;
		onFinished();
	};
	
	if (this.pageGroup_active != null) {
		this._hideContentPage();
		goog.events.dispatchEvent(this.pageGroup_active, ttapp.gui.pages.EventType.PAGEGROUP_HIDE);
		onContentHidden();
	} else {
		// no content to hide => mark as hidden directly
		onContentHidden();
	}
	// hide menu
	this._clearMenu(onMenuHidden);
	
	// step 2: init page group
	ttapp.debug.debug(ttapp.gui.pages.MODULE, 'load menu');
	var onMenu = function(items) {
		ttapp.debug.debug(ttapp.gui.pages.MODULE, 'menu loaded: ', items);
		state.menu = items;
		onFinished();
	};
	this.pageGroup_loading._getMenuItems(onMenu);
	
	// step 3: init content page
	ttapp.debug.debug(ttapp.gui.pages.MODULE, 'load content page');
	var onContentPage = function(page) {
		ttapp.debug.debug(ttapp.gui.pages.MODULE, 'content page loaded', page);
		state.content = page;
		onFinished();
	};
	
	
	onContentPage(pageGroup.getDefaultPage()); // TODO
}

/**
 * @private
 * @type {Array<!Node>}
 */
ttapp.gui.pages.PageContainer.prototype.menuItems_ = [];

/**
 * @private
 * @type {?Element}
 */
ttapp.gui.pages.PageContainer.prototype.currentPage_ = null;

/**
 * @const
 * @type {number}
 */
ttapp.gui.pages.MENU_DELAY_PER_ROW = 50;

/**
 * @const
 * @type {number}
 */
ttapp.gui.pages.MENU_DELAY_BEFORE_REMOVE = 500;

/**
 * @private
 * @param {Function} finishCallback
 */
ttapp.gui.pages.PageContainer.prototype._clearMenu = function(finishCallback) {
	ttapp.debug.debug(ttapp.gui.pages.MODULE, "hide menu", this.menuItems_);
	if (this.menuItems_.length == 0) {
		finishCallback();
		return;
	} else {		
		while(this.menuItems_.length > 0) {
			var item = this.menuItems_.pop();
			
			goog.dom.removeNode(item);
		}
		finishCallback();
	}
};

/**
 * @private
 */
ttapp.gui.pages.PageContainer.prototype._hideContentPage = function() {
	if (this.currentPage_) {
		goog.dom.removeNode(this.currentPage_);
		this.currentPage_ = null;
	}
}

/**
 * @private
 * @param {!ttapp.gui.pages.ContentPage} contentPage
 */
ttapp.gui.pages.PageContainer.prototype._showContent = function(contentPage) {
	/** @type {!Element} */
	var pageNode = contentPage.getPageElement();
	
	//console.log(pageNode, this.currentPage_);
	
	if (pageNode != this.currentPage_) {
		this._hideContentPage();
		this.currentPage_ = pageNode;
		goog.dom.appendChild(this.contentContainer_, pageNode);
	}
}

/**
 * @private
 * @param {Array<ttapp.gui.menu.AbstractMenuItem>} items
 */
ttapp.gui.pages.PageContainer.prototype._showMenu = function(items) {
	var delay = 1;
	var createShowMethod = function(obj) {
		return function() {
			goog.dom.classlist.remove(obj, goog.getCssName('hidden-left'));
		}
	};
	var l = items.length;
	for(var i=0; i<l; ++i) {
		/** @type {!Node} */
		var item = items[i].getRootElement();
		
		
		goog.dom.classlist.add(item, goog.getCssName('hidden-left'));
		goog.dom.appendChild(this.sidemenu, item);
		this.menuItems_.push(item);
		setTimeout(createShowMethod(item), delay);
		
		delay += ttapp.gui.pages.MENU_DELAY_PER_ROW;
	}
}

/**
 * @public
 * @constructor
 */
ttapp.gui.pages.ContentPage = function() {
}

/**
 * @private
 * @type {?Element}
 */
ttapp.gui.pages.ContentPage.prototype.pageElement_ = null;

/**
 * @protected
 * @return {!Element}
 */
ttapp.gui.pages.ContentPage.prototype._createElement = function() {
	return goog.dom.createElement(goog.dom.TagName.DIV);
}

/**
 * @protected
 * @param {!Element} root
 */
ttapp.gui.pages.ContentPage.prototype._decorateElement = function(root) {
}

/**
 * @private
 * @return {!Element}
 */
ttapp.gui.pages.ContentPage.prototype.getPageElement = function() {
	if (this.pageElement_ == null) {
		this.pageElement_ = this._createElement();
		this._decorateElement(this.pageElement_);
	}
	return this.pageElement_;
}

/**
 * @protected
 */
ttapp.gui.pages.ContentPage.prototype.loadContent = function() {
	
}

/**
 * @public
 * @constructor
 * @param {!string} label The label of the page group.
 * @param {!ttapp.gui.pages.ContentPage} mainPage The main page of the 
 * 		page group.
 * @param {!ttapp.gui.menu.TopMenu=} opt_topMenu The menu to add this 
 * 		page group to.
 * @extends {goog.events.EventTarget}
 */
ttapp.gui.pages.PageGroup = function(label, mainPage, opt_topMenu) {
	
	ttapp.gui.pages.PageGroup.base(this, 'constructor');

	/**
	 * The label of the page group.
	 * 
	 * @private
	 * @type {!string}
	 */
	this.label_ = label;
	
	/**
	 * The main page of the page group.
	 *
	 * @private
	 * @type {!ttapp.gui.pages.ContentPage}
	 */
	this.mainPage_ = mainPage;
	
	
	if (opt_topMenu) {
		var link = opt_topMenu.addLink(label, ttapp.proxy(this.show, this));
		
		var onEvent = function(e) {
			link.setActive(e.type == ttapp.gui.pages.EventType.PAGEGROUP_SHOW);
		}
		goog.events.listen(this, ttapp.gui.pages.EventType.PAGEGROUP_SHOW, onEvent);
		goog.events.listen(this, ttapp.gui.pages.EventType.PAGEGROUP_HIDE, onEvent);
	}
}
goog.inherits(ttapp.gui.pages.PageGroup, goog.events.EventTarget);

/**
 * Holds the page container to use.
 * 
 * @private
 * @type {!ttapp.gui.pages.PageContainer}
 */
ttapp.gui.pages.PageGroup.container_;

/**
 * Sets the page container to use.
 * 
 * @public
 * @param {!ttapp.gui.pages.PageContainer} container
 */
ttapp.gui.pages.PageGroup.setContainer = function(container) {
	ttapp.gui.pages.PageGroup.container_ = container;
}

/**
 * @protected
 * @param {!ttapp.gui.pages.PageContainer} pc
 */
ttapp.gui.pages.PageGroup.prototype._show = function(pc) {
	pc.showPageGroup(this);
}

/**
 * Shows this page group.
 * 
 * @public
 */
ttapp.gui.pages.PageGroup.prototype.show = function() {
	if (ttapp.gui.pages.PageGroup.container_) {
		this._show(ttapp.gui.pages.PageGroup.container_);
	}
}



/**
 * @private
 * @type {?Array<ttapp.gui.menu.AbstractMenuItem>}
 */
ttapp.gui.pages.PageGroup.prototype.menuItems_ = null;

/**
 * @protected
 * @return {!boolean}
 */
ttapp.gui.pages.PageGroup.prototype._mustReloadMenuItems = function() {
	return this.menuItems_ == null;
}

/**
 * @protected
 * @param {function(Array<ttapp.gui.menu.AbstractMenuItem>)} callback 
 */
ttapp.gui.pages.PageGroup.prototype._loadMenuItems = function(callback) {
	callback([]);
}


/**
 * @private
 * @param {function(Array<ttapp.gui.menu.AbstractMenuItem>)} callback 
 * 		The callback method, called after retrieving all menu items.
 */
ttapp.gui.pages.PageGroup.prototype._getMenuItems = function(callback) {
	if (this._mustReloadMenuItems()) {
		
		var pg = this;
		
		/**
		 * @param {Array<ttapp.gui.menu.AbstractMenuItem>} items
		 */
		var setItems = function(items) {
			pg.menuItems_ = items;
			callback(items);
		}
		
		this._loadMenuItems(setItems);
	} else {
		callback(this.menuItems_);
	}
}

/**
 * @public
 * @return {?ttapp.gui.pages.ContentPage}
 */
ttapp.gui.pages.PageGroup.prototype.getDefaultPage = function() {
	return this.mainPage_;
}


/**
 * @constructor
 * @public
 * @param {!string} label The label for the menu item
 * @param {!ttapp.gui.pages.ContentPage} page The content page
 * @param {!Function=} opt_initCall 
 * @extends {ttapp.gui.menu.SimpleMenuItem}
 */
ttapp.gui.pages.PageMenuLink = function(label, page, opt_initCall) {
	var cb = function() {
		var container = ttapp.gui.pages.PageGroup.container_;
		if (container != null) {
			if (opt_initCall) {
				opt_initCall();
			} else {
				page.loadContent();
			}
			container._showContent(page);
		}
	};
	
	ttapp.gui.pages.PageMenuLink.base(this, 'constructor', label, cb)
}
goog.inherits(ttapp.gui.pages.PageMenuLink, ttapp.gui.menu.SimpleMenuItem);
