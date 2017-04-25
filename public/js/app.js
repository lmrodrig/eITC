var app = angular.module('App', ['ionic', 'ngRoute','treeControl']);

//var busyIndicator = new WL.BusyIndicator('content');
/*var busyIndicator = new WL.BusyIndicator('menuContent');
app.factory("busyIndicator",function()
	{
		return busyIndicator;
	}		
);*/
app.factory("busyIndicator",function(){
		var busyIndicator = {};
		busyIndicator.show = function(){
			
		};
		busyIndicator.hide = function(){
			
		};
		return busyIndicator;
	}
);

app.config(function($ionicConfigProvider) {
	  $ionicConfigProvider.views.transition('none');
	  $ionicConfigProvider.tabs.position('bottom'); // other values: top
	});

app.config(['$compileProvider',
            function ($compileProvider) {
                $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
        }]);

app.directive( "fileModel", [ "$parse", function( $parse ) {
    return {
        restrict: "A",
        link: function( scope, element, attrs ) {

            var model = $parse( attrs.fileModel );

            element.bind( "change", function() {
                scope.$apply( function() {
                    model.assign( scope, element[ 0 ].files[ 0 ] );
                });
            });

        }
    }
}]);

app.directive('fileDownload', function ($compile) {
    return {
        restrict:'E',
        scope:{ getUrlData:'&getData'},
        link:function (scope, elm, attrs) {
            var url = URL.createObjectURL(scope.getUrlData());
            elm.append($compile(
                '<a class="btn" download="backup.json"' +
                    'href="' + url + '">' +
                    'Download' +
                    '</a>'
            )(scope));
        }
    };
});

app.filter('orderObjectBy', function(){
	 return function(input, attribute) {
	    if (!angular.isObject(input)) return input;

	    var array = [];
	    for(var objectKey in input) {
	        array.push(input[objectKey]);
	    }

	    array.sort(function(a, b){
	        a = parseInt(a[attribute]);
	        b = parseInt(b[attribute]);
	        return a - b;
	    });
	    return array;
	 }
	});

app.config(function($ionicConfigProvider) {
	  $ionicConfigProvider.views.transition('none');
	  $ionicConfigProvider.tabs.position('bottom'); // other values: top
	});

app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('main', {
    	cache: false,
    	url: "/config",
    	abstract: true,
    	templateUrl: "views/menu.html"
    })
    .state('main.intro', {
    	cache: false,
    	url: "/intro",
    	views: {
    		'menuContent' :{
    			templateUrl: "views/intro.html",
    			controller: "introController"
    		}
    	}
    })
    .state('main.productBases', {
    	cache: false,
    	url: "/productBases",
    	views: {
    		'menuContent' :{
    			templateUrl: "views/productBases.html",
    			controller: "productBasesController"
    		}
    	}
    })
    .state('main.createSession', {
    	cache: false,
    	url: "/createSession/:pbId",
    	views: {
    		'menuContent' :{
    			templateUrl: "",
    			controller: "createSessionController"
    		}
    	}
    })
    .state('main.selectConfigurationFile', {
    	cache: false,
    	url: "/selectConfigurationFile",
    	views: {
    		'menuContent' :{
    			templateUrl: "views/selectConfigurationFile.html",
    			controller: ""
    		}
    	}
    })
    .state('main.selectCFRFile', {
    	cache: false,
    	url: "/selectCFRFile",
    	views: {
    		'menuContent' :{
    			templateUrl: "views/selectCFRFile.html",
    			controller: ""
    		}
    	}
    })
    .state('main.restoreConfiguration', {
    	cache: false,
    	url: "/restoreSession",
    	views: {
    		'menuContent' :{
    			templateUrl: "views/productBases.html",
    			controller: "restoreSessionController"
    		}
    	}
    })
   .state('main.startOver', {
   	cache: false,
      url: "/startOver",
      views: {
        'menuContent' :{
          templateUrl: "",
          controller: "closeSessionController"
        }
      }
    })
    .state('main.sessionDetails', {
    	cache: false,
      url: "/sessionDetails",
      views: {
        'menuContent' :{
          templateUrl: "views/sessionDetails.html",
          controller: "sessionDetailsController"
        }
      }
    })
    .state('main.customizeCurrent', {
    	cache: false,
      url: "/customize",
      views: {
        'menuContent' :{
          templateUrl: "views/customize.html",
          controller: "customizeController"
        }
      }
    })
    .state('main.customizeWithId', {
    	cache: false,
      url: "/customize/:id",
      views: {
        'menuContent' :{
          templateUrl: "views/customize.html",
          controller: "customizeController"
        }
      }
    })
//    .state('main.results', {
//    	cache: false,
//      url: "/results",
//      views: {
//        'menuContent' :{
//          templateUrl: "views/results.html",
//          controller: "resultsController"
//        }
//      }
//    })
      .state('results', {
 //   	cache: false,
    	url: "/results",
  		abstract: true,
  		 parent: "main",
       views: {
       'menuContent' :{
         templateUrl: "views/results.html",
         controller: "resultsController"
       }
       }
     })
    .state('results.edit', {
 //   	cache: false,
      url: "/edit",
       views: {
    	   'edit-tab' :{
          templateUrl: "views/edit.html",
          controller: "editController"
        }
      }
    })
    .state('results.catalog', {
 //   	cache: false,
      url: "/catalog",
      views: {
        'catalog-tab' :{
          templateUrl: "views/catalog.html",
          controller: "catalogController"
        }
      }
    })
    .state('results.messages', {
 //   	cache: false,
      url: "/messages",
      views: {
        'messages-tab' :{
          templateUrl: "views/messages.html",
          controller: "messagesController"
        }
      }
    })
    .state('results.summary', {
 //   	cache: false,
      url: "/summary",
      views: {
        'summary-tab' :{
          templateUrl: "views/summary.html",
          controller: "summaryController"
        }
      }
    })
    .state('results.diagram', {
 //   	cache: false,
      url: "/diagram",
      views: {
        'diagram-tab' :{
          templateUrl: "views/diagram.html",
          controller: "diagramController"
        }
      }
    })


    .state('main.trace', {
    	cache: false,
      url: "/trace",
      views: {
        'menuContent' :{
          templateUrl: "views/trace.html",
          controller: "traceController"
        }
      }
    })
  
  $urlRouterProvider.otherwise("/config/intro");
})

