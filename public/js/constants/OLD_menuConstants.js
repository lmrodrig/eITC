app.constant('MENU_ITEMS', (function() {
    return {
    	CUSTOMIZE_MENU : 	         
    	{
       	 	"label" : "Customize",
       	 	"id" : "customizeTab", 
       	 	"class" : "button button-clear ion-ios-glasses-outline", 
       	 	"ng-href" : "#customize", 
       	 	"ng-click" : "tabSelect('customizeTab')", 
       	 	"iconClass" : "icon ion-ios-glasses-outline calm"
        },
        RESULTS_MENU : 	         
        {
        	"label" : "Results",
        	"id" : "resultsTab", 
        	"class" : "tab-item main-tab", 
        	"ng-href" : "#results", 
        	"ng-click" : "tabSelect('resultsTab')", 
        	"iconClass" : "icon ion-ios-glasses-outline calm"
        }

      }
}));