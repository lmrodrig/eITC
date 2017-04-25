app.controller('createSessionController',
		function($http,$ionicPopup,$scope,$stateParams,createSessionService,Session,header,$location,busyIndicator)
		{
			var sessions = [
            { sessionID: 1234,
              date: 'feb',
            }];

			$scope.createSession = function(pbId)
			{
				$scope.session = sessions;
				//header.setLoading(true);
				//header.setStatus(5);
				header.setLoading(false);
				console.log("sessionId " + sessions.sessionID);
	    		Session.setId(sessions.sessionID);
		    	$scope.errorMsg ="";
				$scope.$broadcast('scroll.refreshComplete');
				$location.path("config/customize");
				header.setLoading(false);
				/*
				$scope.session = [];
				header.setLoading(true);
				header.setStatus(5);

				
				createSessionService(pbId).then(function(response)
				{
					$scope.session = response;
		    		console.log("sessionId " + response.sessionID);
		    		Session.setId(response.sessionID);
		    		//Session.setCurrentDataId(response.currentWizardID);
					$scope.errorMsg = response.failureMessage;
					$scope.$broadcast('scroll.refreshComplete');
					$location.path("config/customize");
				},
				function(error)
				{
					$scope.errorMsg = "Could not create session";
					$scope.$broadcast('scroll.refreshComplete');
					header.setLoading(false);
					$ionicPopup.alert({
					       title: error.failureMessage,
					       template: $scope.errorMsg
					     });
					
					Session.close();
					$location.path("config/info");
				}); */
			};
			
			$http.get("layout/layout.json").success(function (response) 
				    {
						Session.setLayout(response); 
						//console.log("layout",response);
				    });
			
			$http.get("layout/additionalMetaData.json").success(function (response) 
				    {
						Session.setAdditionalMetaData(response); 
						console.log("additionalMetaData",response);
				    });


			$scope.pbId = $stateParams.pbId;
			$scope.createSession($stateParams.pbId);		
		}		
);

app.controller('restoreSessionController',
		function($ionicHistory,$http,$ionicPopup,$scope,$routeParams,restoreSessionService,Session,header,$location,busyIndicator)
		{	
			$scope.uploadFile = function() {
				console.log("Uploaded file ",$scope.fileToUpload);
				if(angular.isUndefined($scope.fileToUpload)){
					$scope.errorMsg = "Please select a valid file to restore";
					$scope.$broadcast('scroll.refreshComplete');
					$ionicPopup.alert({
				       title: "No file selected",
				       template: $scope.errorMsg
				     });
				}
				else{
						$scope.uploading =true;
						header.setLoading(true);
	
						
						restoreSessionService($scope.fileToUpload).then(function(response)
						{
							header.setLoading(false);
							$scope.uploading=false;
							$scope.session = response;
				    		console.log("sessionId " + response.sessionID);
				    		Session.setId(response.sessionID);
				    		//Session.setCurrentDataId(response.currentWizardID);
							$scope.errorMsg = response.failureMessage;
							$scope.$broadcast('scroll.refreshComplete');
							$ionicHistory.clearCache().then(function(){ $location.path("config/results/edit")});
						},
						function(error)
						{
							$scope.errorMsg = "Could not restore configuration";
							$scope.$broadcast('scroll.refreshComplete');
							header.setLoading(false);
							$ionicPopup.alert({
							       title: error.failureMessage,
							       template: $scope.errorMsg
							     });
							
							Session.close();
							$location.path("config/info");
						});
					};
				}
			
			$http.get("layout/layout.json").success(function (response) 
				    {
						Session.setLayout(response); 
						//console.log("layout",response);
				    });
			
			$http.get("layout/additionalMetaData.json").success(function (response) 
				    {
						Session.setAdditionalMetaData(response); 
						console.log("additionalMetaData",response);
				    });

				
		}
);

app.controller('importCFRController',
		function($ionicHistory,$http,$ionicPopup,$scope,$routeParams,restoreSessionService,Session,header,$location,busyIndicator)
		{	
			$scope.uploadFile = function() {
				if(angular.isUndefined($scope.fileToUpload)){
					$scope.errorMsg = "Please select a valid cfr file to import";
					$scope.$broadcast('scroll.refreshComplete');
					$ionicPopup.alert({
				       title: "No file selected",
				       template: $scope.errorMsg
				     });
				}
				else{
						$scope.uploading = true;
						header.setLoading(true);
						console.log("Uploaded cfr file ",$scope.fileToUpload);
						
						header.setLoading(false);
						$scope.uploading = false;

						$location.path("config/info");

					};
				}
			
				
		}
);

app.controller('closeSessionController',
		function($ionicHistory,$ionicPopup,$scope,$routeParams,closeSessionService,Session,header,$location,busyIndicator)
		{
			$scope.closeSession = function(sessionID)
			{
				if (sessionID == 0) {
					$location.path("config/intro");
					return;
				}
				
				$scope.session = [];
				header.setLoading(true);
				header.setStatus(6);

				
				closeSessionService(sessionID).then(function(response)
				{
					$scope.session = response;
		    		console.log("session closed");
					$scope.errorMsg = response.failureMessage;
					$scope.$broadcast('scroll.refreshComplete');
					header.setLoading(false);

					Session.close();
					$ionicHistory.clearCache().then(function(){$location.path("config/intro")});
				},
				function(error)
				{
					$scope.errorMsg = "Could not close session";
					$scope.$broadcast('scroll.refreshComplete');
					header.setLoading(false);
					console.log($scope.errorMsg, error);
					//if (error.failureMessage != "Session does not exist!") {
						$ionicPopup.alert({
					       title: "Error",
					       template: $scope.errorMsg
					     });
					//}
					
					Session.close();
					$location.path("config/info");
				});
			};
			$scope.closeSession(Session.getId());		
		}		
);

app.controller('sessionDetailsController',
		function($ionicPopup,$scope,$routeParams,sessionDetailsService,Session,header,$location,busyIndicator)
		{
			$scope.header = header;
			$scope.getSessionDetails = function(sessionID)
			{
				if (sessionID == 0) {
					$location.path("config/intro");
					return;
				}

				$scope.session = [];
				header.setLoading(true);

				
				sessionDetailsService(sessionID).then(function(response)
				{
					$scope.session = response;
					$scope.json = JSON.stringify(response, null, 3);
					$scope.errorMsg = response.failureMessage;
					$scope.$broadcast('scroll.refreshComplete');
					header.setLoading(false);

				},
				function(error)
				{
					$scope.errorMsg = "Could not get session details";
					$scope.$broadcast('scroll.refreshComplete');
					header.setLoading(false);

					$ionicPopup.alert({
					       title: error.failureMessage,
					       template: $scope.errorMsg
					     });
					
					Session.close();
					$location.path("config/info");
				});
			};
			$scope.getSessionDetails(Session.getId());	
			
			
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

app.controller('restoreConfigurationSessionController',
		function($ionicPopup,$scope,$routeParams,saveSessionService,Session,header,$location,busyIndicator)
		{
			$scope.header = header;
			$scope.saveSessionDetails = function(sessionID)
			{
				//saveSessionService(Session.getId());
			}

		}		
);