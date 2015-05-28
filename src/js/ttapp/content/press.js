goog.provide('ttapp.content.press');

goog.require('ttapp.api.API');
goog.require('ttapp.api.press');
goog.require('ttapp.gui.pages');
goog.require('ttapp.gui.menu');

/**
 * @private
 * @constructor
 * @extends {ttapp.gui.pages.ContentPage}
 */
ttapp.content.press.ArticleListPage = function() {
	ttapp.content.press.ArticleListPage.base(this, 'constructor');
}
goog.inherits(ttapp.content.press.ArticleListPage, ttapp.gui.pages.ContentPage);

/**
 * @public
 * @constructor
 * @extends {ttapp.gui.pages.PageGroup}
 * @param {!ttapp.api.API} api
 * @param {!ttapp.gui.menu.TopMenu=} opt_headMenu
 * @param {!string=} opt_label
 */
ttapp.content.press.PageGroup = function(api, opt_headMenu, opt_label) {
	var mainPage = new ttapp.content.press.ArticleListPage();
	
	ttapp.content.press.PageGroup.base(this, 'constructor', 
			opt_label || "Presse", mainPage, opt_headMenu);
			
	/**
	 * @private
	 * @type {!ttapp.api.press.API}
	 */
	this.api_ = new ttapp.api.press.API(api);
	
	/**
	 * @private
	 * @type {{
	 * 		main:		!ttapp.content.press.ArticleListPage
	 * }}
	 */
	this.pages_ = {
		main: mainPage
	};
}
goog.inherits(ttapp.content.press.PageGroup, ttapp.gui.pages.PageGroup);

/**
 * @public
 * @param {!number} archiveId
 */
ttapp.content.press.PageGroup.prototype.showArchive = function(archiveId) {
	console.log(archiveId);
}

/**
 * @public
 * @param {!number} archiveId
 * @return {function()}
 */
ttapp.content.press.PageGroup.prototype.createShowArchiveFunction = function(archiveId) {
	var self = this;
	return function() {
		self.showArchive(archiveId);
	};
};


/**
 * @protected
 * @param {function(Array<ttapp.gui.menu.AbstractMenuItem>)} callback 
 */
ttapp.content.press.PageGroup.prototype._loadMenuItems = function(callback) {
	var list = [];
	
	list.push(new ttapp.gui.pages.PageMenuLink('Neuste Artikel', this.pages_.main));
	
	var self = this;
	
	/**
	 * @param {ttapp.api.press.CategoriesModel} cats
	 */
	var onReceive = function(cats) {
		if (cats.archives.length > 0) {
			list.push(new ttapp.gui.menu.HeadlineMenuItem('Archiv'));
			
			goog.array.forEach(cats.archives, function(archive) {
				list.push(new ttapp.gui.menu.SimpleMenuItem(archive.label,
					self.createShowArchiveFunction(archive.archiveId)));
			});
		}
		
		callback(list);
	}
	
	this.api_.getCategories(onReceive);
	
}
