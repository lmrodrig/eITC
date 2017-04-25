app.factory("partsListService", function($http, $q, $stateParams, generateUrlString) {
	return function(sessionID) {

		var deferred = $q.defer();

		$http.get(generateUrlString("session~" + sessionID + "~partsList")).success(function(data) {
			deferred.resolve(data);
		}).error(function(data) {
			deferred.reject("Failed to get parts list " + data);
		});
		return deferred.promise;

	};
});

app.factory("addPartService", function($http, $q, $stateParams, generateUrlString) {
	return function(sessionID, componentID) {

		var deferred = $q.defer();
		
		var reqObj = { "componentID" : componentID, "event" : "double_click"};


		$http.post(generateUrlString("session~" + sessionID + "~partsList~event"), reqObj).success(function(data) {
			deferred.resolve(data);
		}).error(function(data) {
			deferred.reject("add part failed " + data);
		});
		return deferred.promise;

	};
});

app.factory("wizardListService", function($http, $q, $stateParams, generateUrlString) {
	return function(sessionID) {

		var deferred = $q.defer();

		$http.get(generateUrlString("session~" + sessionID + "~wizardView")).success(function(data) {
			deferred.resolve(data);
		}).error(function(data) {
			deferred.reject("Failed to get wizard list " + data);
		});
		return deferred.promise;

	};
});

app.factory("wizardEventService", function($http, $q, $stateParams, generateUrlString) {
	return function(sessionID, wizardID, actionID, actionName) {

		var deferred = $q.defer();

		var reqObj = { "wizardID" : wizardID, "actionID" : actionID, "actionName" : actionName};
		
		$http.post(generateUrlString("session~" + sessionID + "~wizardView~event"), reqObj).success(function(data) {
			deferred.resolve(data);
		}).error(function(data) {
			deferred.reject("Failed to post wizardView event " + data);
		});
		return deferred.promise;

	};
});

app.factory("messagesService", function($http, $q, $stateParams, generateUrlString) {
	return function(sessionID) {

		var deferred = $q.defer();

		$http.get(generateUrlString("session~" + sessionID + "~messageView")).success(function(data) {
			deferred.resolve(data);
		}).error(function(data) {
			deferred.reject("Failed to get messages " + data);
		});
		return deferred.promise;

	};
});

app.factory("quotesService", function($http, $q, $stateParams, generateUrlString) {
	return function(sessionID) {

		var deferred = $q.defer();

		$http.get(generateUrlString("session~" + sessionID + "~quoteView")).success(function(data) {
			deferred.resolve(data);
		}).error(function(data) {
			deferred.reject("Failed to get quotes " + data);
		});
		return deferred.promise;

	};
});

app.factory("viewService", function($http, $q, $stateParams, generateUrlString) {
	return function(sessionID) {

		var deferred = $q.defer();

		$http.get(generateUrlString("session~" + sessionID + "~quoteView")).success(function(data) {
			deferred.resolve(data);
		}).error(function(data) {
			deferred.reject("Failed to get quotes " + data);
		});
		return deferred.promise;

	};
});

app.factory("diagramDataService",function($http,$q,$routeParams,generateUrlString,BACKEND){
	return function(sessionID,svg){
		var deferred = $q.defer();
		var url = "";
		if(svg){
			url = generateUrlString("session~"+sessionID+"~diagram?format=SVG");
			//url = "https://"+BACKEND().ENDPOINT_URL+"/session/"+sessionID+"/diagram?format=SVG";
		}
		else{
			url = generateUrlString("session~"+sessionID+"~diagram");
			//url = "https://"+BACKEND().ENDPOINT_URL+"/session/"+sessionID+"/diagram";
		} 
		$http.get(url).success(function(data) {
    		deferred.resolve(data);
		}).error(function(data) {
			deferred.reject(data);
		});
		
		return deferred.promise;
	};
});