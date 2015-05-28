goog.provide('ttapp.content.config');

goog.require('ttapp.gui.pages');
goog.require('ttapp.gui.menu');

/**
 * @private
 * @constructor
 * @extends {ttapp.gui.pages.ContentPage}
 */
ttapp.content.config.UserConfigPage = function() {
	ttapp.content.config.UserConfigPage.base(this, 'constructor');
}
goog.inherits(ttapp.content.config.UserConfigPage, ttapp.gui.pages.ContentPage);


/**
 * @protected
 * @param {!Element} root
 */
ttapp.content.config.UserConfigPage.prototype._decorateElement = function(root) {
	var h = goog.dom.createDom('h1', null, 'Hallo Welt');
	goog.dom.appendChild(root, h);
	
}


/**
 * @public
 * @constructor
 * @extends {ttapp.gui.pages.PageGroup}
 * @param {!ttapp.gui.menu.TopMenu=} opt_headMenu
 * @param {!string=} opt_label
 */
ttapp.content.config.PageGroup = function(opt_headMenu, opt_label) {
	var mainPage = new ttapp.content.config.UserConfigPage();
	
	ttapp.content.config.PageGroup.base(this, 'constructor', 
			opt_label || "Einstellungen", mainPage, opt_headMenu);
			
			
	
	
	/**
	 * @private
	 * @type {{
	 * 		user:		!ttapp.content.config.UserConfigPage
	 * }}
	 */
	this.pages_ = {
		user: mainPage
	};
}
goog.inherits(ttapp.content.config.PageGroup, ttapp.gui.pages.PageGroup);




/**
 * @protected
 * @param {function(Array<ttapp.gui.menu.AbstractMenuItem>)} callback 
 */
ttapp.content.config.PageGroup.prototype._loadMenuItems = function(callback) {
	var list = [];
	
	list.push(new ttapp.gui.pages.PageMenuLink('Benutzer', this.pages_.user));
	
	callback(list);
}
