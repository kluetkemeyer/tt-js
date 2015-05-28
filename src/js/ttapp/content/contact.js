goog.provide('ttapp.content.contact');

goog.require('ttapp.api.imprint');

goog.require('ttapp.gui');
goog.require('ttapp.gui.pages');
goog.require('ttapp.gui.menu');
goog.require('ttapp.gui.tpl.sites.contact');

/**
 * @private
 * @constructor
 * @extends {ttapp.gui.pages.ContentPage}
 */
ttapp.content.contact.ContactPage = function() {
	ttapp.content.contact.ContactPage.base(this, 'constructor');
}
goog.inherits(ttapp.content.contact.ContactPage, ttapp.gui.pages.ContentPage);

/**
 * @protected
 * @param {!Element} root
 */
ttapp.content.contact.ContactPage.prototype._decorateElement = function(root) {
	var frag = soy.renderAsFragment(ttapp.gui.tpl.sites.contact.contactform);
	
	goog.dom.appendChild(root, frag);
}


/**
 * @private
 * @constructor
 * @extends {ttapp.gui.pages.ContentPage}
 * @param {!ttapp.api.imprint.API} api
 */
ttapp.content.contact.ImprintPage = function(api) {
	ttapp.content.contact.ImprintPage.base(this, 'constructor');
	
	/**
	 * @type {!ttapp.api.imprint.API}
	 * @private
	 */
	this.api_ = api;
	
	/**
	 * @private 
	 * @type !Array<!Element>
	 */
	this.sections_ = [];
	
	/**
	 * @private
	 * @type {!number}
	 */
	this.state_ = ttapp.content.contact.ImprintPage.State.UNDEFINED;
}
goog.inherits(ttapp.content.contact.ImprintPage, ttapp.gui.pages.ContentPage);

/**
 * @private
 * @enum {number}
 */
ttapp.content.contact.ImprintPage.State = {
	UNDEFINED: 0,
	LOADING: 1,
	LOADED: 2
};

/**
 * @protected
 * @param {!Element} root
 */
ttapp.content.contact.ImprintPage.prototype._decorateElement = function(root) {
	var frag = soy.renderAsFragment(ttapp.gui.tpl.sites.contact.imprintpage);
	
	goog.dom.appendChild(root, frag);	
}

/**
 * @protected
 */
ttapp.content.contact.ImprintPage.prototype.loadContent = function() {	
	var States = ttapp.content.contact.ImprintPage.State;
	if (this.state_ == States.UNDEFINED) {
		var page = this;
		var onLoad = function(roles, disclaimers) {
			if (roles == null || disclaimers == null) {
				page.state_ = States.UNDEFINED;
			} else {
				page.state_ = States.LOADED;
				page._setContent(roles, disclaimers);
			}
		}
		
		this.state_ = States.LOADING;
		this.api_.loadImprint(onLoad);
	}
}

/**
 * @private
 * @param {?Array<!ttapp.api.imprint.Role>} roles
 * @param {?Array<!ttapp.api.imprint.Disclaimer>} disclaimers
 */
ttapp.content.contact.ImprintPage.prototype._setContent = function(roles, disclaimers) {
	while(this.sections_.length > 0) {
		/** @typedef {!Element} */
		var section = this.sections_.pop();
		goog.dom.removeNode(section);
	}
	
	var page = this;
	var root = this.getPageElement();
	
	/**
	 * @param {!Element} e
	 */
	var append = function(e) {
		page.sections_.push(e);
		goog.dom.appendChild(root, e);
	};
	
	if (roles != null) {
		goog.array.forEach(roles, function(role) {
			/** @typedef {!Element} */
			var section = ttapp.gui.createElementFromTemplate(ttapp.gui.tpl.sites.contact.imprintrole, role);
			
			append(section);	
		});
	}
	if (disclaimers != null) {
		goog.array.forEach(disclaimers, function(disclaimer) {
			/** @typedef {!Element} */
			var section = ttapp.gui.createElementFromTemplate(ttapp.gui.tpl.sites.contact.disclaimerSection, disclaimer);
			
			append(section);			
		});
	}
}


/**
 * @private
 * @constructor
 * @extends {ttapp.gui.pages.ContentPage}
 */
ttapp.content.contact.ManagementPage = function() {
	ttapp.content.contact.ManagementPage.base(this, 'constructor');
}
goog.inherits(ttapp.content.contact.ManagementPage, ttapp.gui.pages.ContentPage);

/**
 * @public
 * @constructor
 * @extends {ttapp.gui.pages.PageGroup}
 * @param {!ttapp.api.API} api
 * @param {!ttapp.gui.menu.TopMenu=} opt_headMenu
 * @param {!string=} opt_label
 */
ttapp.content.contact.PageGroup = function(api, opt_headMenu, opt_label) {
	
	var imprintApi = new ttapp.api.imprint.API(api);
	
	
	var mainPage = new ttapp.content.contact.ContactPage();
	
	ttapp.content.contact.PageGroup.base(this, 'constructor', 
			opt_label || "Kontakt", mainPage, opt_headMenu);
			
			
			
	var imprintPage = new ttapp.content.contact.ImprintPage(imprintApi);
	var managementPage = new ttapp.content.contact.ManagementPage();
	
	
	/**
	 * @private
	 * @type {{
	 * 		main:		!ttapp.content.contact.ContactPage,
	 * 		management:	!ttapp.content.contact.ManagementPage,
	 * 		imprint:	!ttapp.content.contact.ImprintPage
	 * }}
	 */
	this.pages_ = {
		main: mainPage,
		management: managementPage,
		imprint: imprintPage
	};
}
goog.inherits(ttapp.content.contact.PageGroup, ttapp.gui.pages.PageGroup);




/**
 * @protected
 * @param {function(Array<ttapp.gui.menu.AbstractMenuItem>)} callback 
 */
ttapp.content.contact.PageGroup.prototype._loadMenuItems = function(callback) {
	var list = [];
	
	list.push(new ttapp.gui.pages.PageMenuLink('Kontaktformular', this.pages_.main));
	list.push(new ttapp.gui.pages.PageMenuLink('Vorstand', this.pages_.management));
	list.push(new ttapp.gui.pages.PageMenuLink('Impressum', this.pages_.imprint));
	
	callback(list);
}
