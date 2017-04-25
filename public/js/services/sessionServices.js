app.factory("createSessionService", function($http, $q, $routeParams, generateUrlString) {
	return function(pbId) {

		var date = new Date();
		console.log("date ", date);
		var offset = date.getTimezoneOffset();
		console.log("offset ", offset);
		var sign = offset < 0 ? "+" : "-";
		var opsign = offset < 0 ? "-" : "+";
		console.log("sign ", sign);
		var singlehours = offset/60;
		var dec = singlehours - Math.floor(singlehours);
		singlehours = Math.abs(singlehours - dec);
		var hours = offset/60;
		var dec = hours - Math.floor(hours);
		hours = hours - dec;
		hours = ("0" + hours).slice(-2);
		console.log("hours", hours);
		var minutes = offset%60;
		minutes = ("0" + minutes).slice(-2);
		console.log("minutes", minutes);

		//var timeZone = "GMT" + sign + hours + ":" + minutes;
		var timeZone = "Etc/GMT" + opsign + singlehours;
		console.log("timeZone ", timeZone);
	
		var reqData = "{\"productBaseID\" : " + pbId + ", \"isUpgrade\" : false, \"timezone\" : \"" + timeZone + "\"}";

		var deferred = $q.defer();

		$http.post(generateUrlString("session"), reqData).success(function(data) {
			deferred.resolve(data);
		}).error(function(data) {
			deferred.reject(data);
		});
		return deferred.promise;

	};
});

app.factory("closeSessionService",function($http,$q,$routeParams,generateUrlString)
		{
			return function(sessionId){
				
				var deferred = $q.defer();

				$http({method: 'DELETE', url: generateUrlString("session~" + sessionId)}).success(function(data) {
					deferred.resolve(data);
				}).error(function(data) {
					deferred.reject(data);
				});
				return deferred.promise;

			};
	});


app.factory("sessionDetailsService",function($http,$q,$routeParams,generateUrlString)
		{
			return function(sessionID){

	    		var deferred = $q.defer();

				$http.get(generateUrlString("session~" + sessionID)).success(function(data) {
					deferred.resolve(data);
				}).error(function(data) {
					deferred.reject(data);
				});

				return deferred.promise;
			};
	});

app.factory("customizeDataService",function($http,$q,$routeParams,generateUrlString)
		{
			return function(sessionID){
				var deferred = $q.defer();

				$http.get(generateUrlString("session~"+sessionID+"~currentWizard")).success(function(data) {
		    		console.log("data ", data);
					deferred.resolve(data);
				}).error(function(data) {
					deferred.reject(data);
				});
				
				return deferred.promise;
			};
	});

app.factory("customizeDataService2",function($http,$q,$routeParams,generateUrlString,customizeDataService)
		{
			return function(sessionID, wizardID){
				
				if (wizardID == 0) {
					return customizeDataService(sessionID);
				}
				
				var deferred = $q.defer();

				$http.get(generateUrlString("session~"+sessionID+"~wizard~" + wizardID)).success(function(data) {
		    		console.log("data ", data);
					deferred.resolve(data);
				}).error(function(data) {
					deferred.reject(data);
				});
				
				return deferred.promise;
			};
	});

app.factory("restoreSessionService", function($http, $q, $routeParams, generateUrlString,BACKEND) {
	return function(restoreFile) {
		var deferred = $q.defer();
		var r = new FileReader();
		 r.onloadend = function(e){
			 var data = e.target.result;
			 var reqData = new Uint8Array(data);
				console.log("restore file to upload... ",reqData);
				
				var urlString = "https://"+BACKEND().ENDPOINT_URL+"/session/restore";//generateUrlString("session~restore")//
				console.log("urlString "+urlString)
				$http({
					method: 'POST',
					url : urlString,
					data : reqData,
					transformRequest:[]
				}).success(function(data) {
					deferred.resolve(data);
				}).error(function(data) {
					deferred.reject(data);
				});
		 }
		r.readAsArrayBuffer(restoreFile);
		return deferred.promise;

	};
});

app.factory('Session',function(header){

    var controlNeedsUpdate = [];
    var session = {};
//    var errors = [];
    var breadcrumbs = [];
    var wizBreadcrumbs = [{"id": 0,"description" : "Top"}];
    var sessionID = 0;
    var hasCustomizationData = false;
    var customizeData = {};
    var currentPanelID = 0;
    var messages = {};
    var layout = {};
    var additionalMetaData = {};


    session.getCurrentPanelID = function() {
    	return currentPanelID;
     }
    
    session.setCurrentPanelID = function(value) {
    	currentPanelID = value;
     }

    session.getControlNeedsUpdate = function() {
    	return controlNeedsUpdate;
     }
    
    session.setControlNeedsUpdate = function(value) {
    	controlNeedsUpdate.push(value);
     }

    session.hasCustomizationData = function() {
    	return hasCustomizationData;
     }
    
    session.setHasCustomizationData = function(value) {
    	hasCustomizationData = value;
     }


    session.hasSession = function() {
    	return sessionID > 0;
     }

    session.setId = function(id) {
        sessionID = id;
       // console.log(" set sessionId " + sessionID);
     }

     session.getId = function() {
         //console.log(" get sessionId " + sessionID);
         return sessionID;
     };

     session.setLayout = function(data) {
      	layout = data;
     }

      session.getLayout = function() {
       	return layout;
      }

      session.setAdditionalMetaData = function(data) {
    	  additionalMetaData = data;
    }

     session.getAdditionalMetaData = function() {
      	return additionalMetaData;
     }

     session.setCustomizeData = function(data) {
    	customizeData = data;
    	hasCustomizationData = true;
     // console.log(" set customizeData ", customizeData);
   }

   session.getCustomizeData = function() {
      // console.log(" get getCustomizeData ", customizeData);
       return customizeData;
   };

   session.setMessages = function(newMessages) {
	  messages = newMessages;
	  if (messages.length == 0) {
			header.setStatus(5);
	  }
	 // console.log(" set messages ", messages);
  }

   session.getMessages = function() {
      // console.log(" get getMesssages ", messages);
       return messages;
   };

    session.getPanelData = function(id) {
       // console.log(" get getPanelData " + id);
        
        return currentDataId;
    };
    
    session.close = function() {
		sessionID = 0;
		hasCustomizationData = false
		messages = [];
		header.setStatus(6);
    }
    
// add functions related to breadcrumbs logic
    session.getCrumbs = function(){
		return breadcrumbs;
	}
    
    session.clearAllCrumbs = function(){
    	breadcrumbs=[];
    }
    session.filterCrumbs = function(dataID){
    	for (var i = 0; i < breadcrumbs.length; i++) {
    		  var crumb = breadcrumbs[i];
    		  if(crumb.id === dataID){
    			  breadcrumbs.splice(i+1,breadcrumbs.length);
    			  return crumb;
    		  }
    	}
	}
    
    session.addCrumbs = function(newCrumb){
    	
    	if(breadcrumbs.length==0){
    		var initialCrumb = new Object();
    		initialCrumb.id=0;
    		initialCrumb.description = "Add Product";
    		initialCrumb.children = newCrumb;
  			breadcrumbs.push(initialCrumb);
  		 }
		else{
			for (var i = 0; i < breadcrumbs.length; i++) {
		  		  var crumb = breadcrumbs[i];
		  		if(crumb == 'undefined' || !(newCrumb.id === crumb.id)){
		  			//console.log("Adding new crumb == "+newCrumb.id+" desc = "+newCrumb.description);
		  			breadcrumbs.push(newCrumb);
		  			break;
		  		}
			}
		}
    	//console.log("Total number of crumbs == "+breadcrumbs.length);
	}
    
    session.removeCrumbs = function(crumb){
    	breadcrumbs.pop(crumb);
	}
    
    session.getWizCrumbs = function(){
		return wizBreadcrumbs;
	}

    session.filterWizCrumbs = function(dataID){
    	for (var i = 0; i < wizBreadcrumbs.length; i++) {
    		  var crumb = wizBreadcrumbs[i];
    		  if(crumb.id === dataID){
    			  wizBreadcrumbs.splice(i+1,wizBreadcrumbs.length);
   				//console.log("crumb ", crumb);
 				//console.log("wizBreadcrumbs ", wizBreadcrumbs);
   			  return crumb;
    		  }
    	}
	}

    session.addWizCrumbs = function(newCrumb){
	  	wizBreadcrumbs.push(newCrumb);
    	//console.log("Total number of crumbs == "+wizBreadcrumbs.length);
	}

    
    session.sortPartNumbers = function(partList, sortAttr){
    	partList.sort(function(a, b) {
		    return parseFloat(a[sortAttr]) - parseFloat(b[sortAttr]);
		});
    }
    return session;
});