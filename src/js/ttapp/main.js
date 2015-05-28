goog.provide('ttapp.main');

goog.require('goog.dom');
goog.require('goog.events');

goog.require('ttapp.debug');
goog.require('ttapp.progress');
goog.require('ttapp.api.API');

goog.require('ttapp.gui.menu');
goog.require('ttapp.gui.pages');
goog.require('ttapp.gui.splashscreen');
goog.require('ttapp.gui.progress');

goog.require('ttapp.content.calendar');
goog.require('ttapp.content.competition');
goog.require('ttapp.content.config');
goog.require('ttapp.content.contact');
goog.require('ttapp.content.press');


/**
 * @export
 */
ttapp.main = function() {
	ttapp.debug.log("main", "application loaded");
	
	var body = /** @type {!Element} */ (document.body);
	var bootProgressCtrl = new ttapp.progress.ProgressCtrl();

	var splashNode = goog.dom.getElement('splashscreen');
	var splashScreen = new ttapp.gui.Splashscreen(splashNode);
	splashScreen.registerProgressCtrl(bootProgressCtrl);
	
	var bootProgress = bootProgressCtrl.startProgress();
	
	// create api
	var api = ttapp.api.API.getInstance();
	
	// create api progress indicator
	var apiProgressBar = new ttapp.gui.progress.apiloader();
	apiProgressBar.appendTo(body);
	apiProgressBar.registerForAPI(api);
	bootProgress.progress(0.1);
	
	// create page container
	var pageContainer = new ttapp.gui.pages.PageContainer();
	pageContainer.setAsMainContainer();
	pageContainer.setVisible(true);
	pageContainer.appendTo(body);
	bootProgress.progress(0.2);
	
	// create pages and register in head menu
	var headMenu = pageContainer.headmenu;
	
	
	bootProgress.progress(0.3);
	new ttapp.content.calendar.PageGroup(api, headMenu);
	new ttapp.content.press.PageGroup(api, headMenu);
	new ttapp.content.competition.PageGroup(api, headMenu);
	new ttapp.content.config.PageGroup(headMenu);	
	new ttapp.content.contact.PageGroup(api, headMenu);
	bootProgress.progress(0.5);
	
	
	// hide splashscreen after everything is initialized
	setTimeout(function() { 
		bootProgress.finish();
		splashScreen.hideAndFree()
	}, 1);
	 
	
};
