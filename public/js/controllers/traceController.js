
app.controller('traceController',
		
		function($ionicPopup,$scope,Trace,getTraceTypesService,getTraceStatusService,getTraceFileService,setTraceService,Session,header,busyIndicator,$location)
		{
			
			$scope.types = [];
			$scope.status = [];
			$scope.errorMsg = "";
			$scope.downloadIsDisabled = Trace.downloadIsDisabled();
			$scope.showDownload = !Trace.downloadIsDisabled();
			$scope.header = header;

			
			$scope.getTraceStatus = function(sessionID, type)
			{
				header.setLoading(true);

				console.log("Calling getTraceStatus Service",$scope);
				getTraceStatusService(sessionID, type).then(function (status)
				{
					console.log("Got TraceStatus",status);
					$scope.status = status;
					$scope.json = JSON.stringify(status, null, 3);
					console.log("$scope.status",$scope.status);
					$scope.$broadcast('scroll.refreshComplete');
					header.setLoading(false);

				},
				function(error)
				{
					$scope.errorMsg = "Could Not get Trace Status";
					$scope.$broadcast('scroll.refreshComplete');
					header.setLoading(false);
					
					$ionicPopup.alert({
					       title: 'Error!',
					       template: error.failureMessage
					     });
					
					Session.close();
					$location.path("config/info");
				});
			};
			//$scope.getTraceStatus(Session.getId(), "basicTrace");
			$scope.getTraceStatus(Session.getId(), "all");
			console.log("traceController",$scope);
			
			$scope.getTraceTypes = function()
			{
				$scope.errorMsg = "";
				header.setLoading(true);

				console.log("Calling getTraceTypes Service",$scope);
				getTraceTypesService().then(function (types)
				{
					console.log("Got Trace Types",types);
					$scope.types = types;
					$scope.$broadcast('scroll.refreshComplete');
					header.setLoading(false);

					$scope.errorMsg = "";
				},
				function(error)
				{
					$scope.errorMsg = "Could Not get Trace Types";
					$scope.$broadcast('scroll.refreshComplete');
					header.setLoading(false);

					$location.path("error");
				});
			};
			$scope.getTraceTypes();
			console.log("traceController",$scope);

			
			$scope.setTrace = function(sessionID, traceTypes, action)
			{
				$scope.errorMsg = "";
				header.setLoading(true);

				console.log("Calling setTrace Service",$scope);
				setTraceService(sessionID, traceTypes, action).then(function (result)
				{
					console.log("Trace.downloadIsDisabled() " + Trace.downloadIsDisabled());
//					$scope.status = status;
					$scope.json = JSON.stringify($scope.status, null, 3);
					$scope.downloadIsDisabled = Trace.downloadIsDisabled();
					$scope.showDownload = !Trace.downloadIsDisabled();
					$scope.$broadcast('scroll.refreshComplete');
					header.setLoading(false);

					$scope.errorMsg = "";
				},
				function(error)
				{
					$scope.errorMsg = "Could Not Set Trace Status";
					$scope.$broadcast('scroll.refreshComplete');
					header.setLoading(false);

					$location.path("error");
				});
			};
			
			  $scope.statusChange = function(index) {
				    console.log('statusChange', $scope.status[index].traceType);
				    console.log('statusChange', $scope.status[index].traceEnabled);
				    var action = "enable";
				    if (!$scope.status[index].traceEnabled) {
				    	action = "disable";
				    }
				    $scope.setTrace(Session.getId(), {"traceTypes" : [ $scope.status[index].traceType ]}, action)
				  };

//			$scope.setTrace(Session.getId(), action);
//			console.log("traceController",$scope);

		    //$scope.initializeTraceStatuses();


		    $scope.getTraceFile = function () {
		    	getTraceFileService(Session.getId());
		    }

			$scope.goBack = function() {
				if (!Session.hasSession) {
					$location.path("config/productBases");
					return;
				};
				if (Session.hasCustomizationData()) {
					$location.path("config/customize");
					return;
				};
				$location.path("config/results");
				return;
			}

			var back;
			if (!Session.hasSession) {
				back = "config/productBases";
			} else if (Session.hasCustomizationData()) {
				back = "config/customize";
			} else {
				back = "config/results";
			}

			header.setBack(back);

		}		
);