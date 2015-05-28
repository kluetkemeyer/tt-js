goog.provide('ttapp.content.competition');

goog.require('ttapp.api.API');
goog.require('ttapp.api.competition');
goog.require('ttapp.gui.pages');
goog.require('ttapp.gui.menu');

/**
 * @private
 * @constructor
 * @extends {ttapp.gui.pages.ContentPage}
 */
ttapp.content.competition.OverviewPage = function() {
	ttapp.content.competition.OverviewPage.base(this, 'constructor');
}
goog.inherits(ttapp.content.competition.OverviewPage, ttapp.gui.pages.ContentPage);

/**
 * @public
 * @constructor
 * @extends {ttapp.gui.pages.PageGroup}
 * @param {!ttapp.api.API} api
 * @param {!ttapp.gui.menu.TopMenu=} opt_headMenu
 * @param {!string=} opt_label
 */
ttapp.content.competition.PageGroup = function(api, opt_headMenu, opt_label) {
	var mainPage = new ttapp.content.competition.OverviewPage();
	
	ttapp.content.competition.PageGroup.base(this, 'constructor', 
			opt_label || "Wettkämpfe", mainPage, opt_headMenu);
			
	/**
	 * @private
	 * @type {!ttapp.api.competition.API}
	 */
	this.api_ = new ttapp.api.competition.API(api);
	
	/**
	 * @private
	 * @type {{
	 * 		main:		!ttapp.content.competition.OverviewPage
	 * }}
	 */
	this.pages_ = {
		main: mainPage
	};
}
goog.inherits(ttapp.content.competition.PageGroup, ttapp.gui.pages.PageGroup);

/**
 * @public
 * @param {!number} competitionId
 */
ttapp.content.competition.PageGroup.prototype.showCompetition = function(competitionId) {
	console.log(competitionId);
}

/**
 * @public
 * @param {!number} competitionId
 * @return {function()}
 */
ttapp.content.competition.PageGroup.prototype.createShowCompetitionFunction = function(competitionId) {
	var self = this;
	return function() {
		self.showCompetition(competitionId);
	};
};


/**
 * @protected
 * @param {function(Array<ttapp.gui.menu.AbstractMenuItem>)} callback 
 */
ttapp.content.competition.PageGroup.prototype._loadMenuItems = function(callback) {
	var list = [];	
	var self = this;
	
	/**
	 * @param {!Array<!ttapp.api.competition.CompetitionModel>} competitions
	 * @param {!string} access
	 */
	var onReceive = function(competitions, access) {
		
		if (competitions.length > 0) {
			list.push(new ttapp.gui.menu.HeadlineMenuItem('aktuelle Wettkämpfe'));
			
			goog.array.forEach(competitions, function(competition) {
				list.push(new ttapp.gui.menu.SimpleMenuItem(competition.label,
					self.createShowCompetitionFunction(competition.competitionId)));
			});
		}
		
		console.log(competitions, access);
		
		callback(list);
	}
	
	this.api_.getActiveCompetitions(onReceive);
	
}
