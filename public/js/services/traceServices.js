app.factory("getTraceTypesService",function($http,$q,generateUrlString)
{
	return function(){
		console.log("In getTraceTypesService Method");
		var deferred = $q.defer();

		$http.get(generateUrlString("trace~level")).success(function(data) {
    		console.log("data ", data);
			deferred.resolve(data);
		}).error(function() {
			deferred.reject("Failed to get trace level: " + data);
		});
		
		return deferred.promise;

	};
});

app.factory("getTraceStatusService",function($http,$q,generateUrlString)
		{
			return function(sessionID, type){
				console.log("In getTraceStatusService Method");

				var deferred = $q.defer();
				
				var types = {"traceTypes" : [ "basicTrace", "fullTrace" ]};

				var endPoint = "session~"+sessionID+"~trace~status?traceType="+type;
				$http.get(generateUrlString(endPoint)).success(function(data) {
		    		console.log("data ", data);
					deferred.resolve(data);
				}).error(function(data) {
					deferred.reject("Failed to get trace status: " + data.toString());
				});
				
				return deferred.promise;

			};
		});

app.factory("getTraceFileService",function($http,$q,BACKEND,generateUrlString)
		{
			return function(sessionID){
				console.log("In getTraceFileService Method");
				
		    	window.open("http://"+BACKEND().ENDPOINT_URL + ":"	+ BACKEND().ENDPOINT_PORT+"/session/"+sessionID+"/trace");
			};
		});

app.factory("setTraceService",function($http,$q,Session,Trace,generateUrlString)
		{
			return function(sessionID, traceTypes, action){
				console.log("In setTraceService Method");
				var deferred = $q.defer();

				//var types = {"traceTypes" : [ "basicTrace", "fullTrace" ]};
				
				var endPoint = "session~"+ sessionID +"~trace~" + action;
				$http.post(generateUrlString(endPoint), traceTypes).success(function(data) {
		    		console.log("data ", data);
		    		Trace.setDownloadIsDisabled(false);
		    		console.log("setDownloadIsDisabled(false) ");
					deferred.resolve(data);
				}).error(function(data) {
					deferred.reject("Failed to set trace status: " + data.toString());
				});
				
				return deferred.promise;

			};
		});

app.factory("Trace",function()
	{
	var downloadIsDisabled = true;
			
	return {
		downloadIsDisabled: function() { return downloadIsDisabled; },
		setDownloadIsDisabled: function(newValue) { downloadIsDisabled = newValue },
	};
});
