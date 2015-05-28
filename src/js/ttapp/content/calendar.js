goog.provide('ttapp.content.calendar');


goog.require('ttapp.api.API');
goog.require('ttapp.gui.pages');
goog.require('ttapp.gui.menu');


/**
 * @private
 * @constructor
 * @extends {ttapp.gui.pages.ContentPage}
 */
ttapp.content.calendar.EventListPage = function() {
	ttapp.content.calendar.EventListPage.base(this, 'constructor');
}
goog.inherits(ttapp.content.calendar.EventListPage,
		ttapp.gui.pages.ContentPage);
		

/**
 * @public
 * @constructor
 * @extends {ttapp.gui.pages.PageGroup}
 * @param {!ttapp.api.API} api
 * @param {!ttapp.gui.menu.TopMenu=} opt_headMenu
 * @param {!string=} opt_label
 */
ttapp.content.calendar.PageGroup = function(api, opt_headMenu, opt_label) {
	var mainPage = new ttapp.content.calendar.EventListPage();
	
	ttapp.content.calendar.PageGroup.base(this, 'constructor', 
			opt_label || "Kalendar", mainPage, opt_headMenu);
			
	/**
	 * @private
	 * @type {!ttapp.api.competition.API}
	 */
	this.api_ = new ttapp.api.competition.API(api);
	
	/**
	 * @private
	 * @type {{
	 * 		eventList:		!ttapp.content.calendar.EventListPage
	 * }}
	 */
	this.pages_ = {
		eventList: mainPage
	};
}
goog.inherits(ttapp.content.calendar.PageGroup, ttapp.gui.pages.PageGroup);
