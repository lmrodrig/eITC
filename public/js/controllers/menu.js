app.controller('MenuController',
		function($http,$scope,$ionicSideMenuDelegate,$location,Session,header,footer,generateUrlString,BACKEND)
		{
			console.log("MenuController",header);
			$scope.header = header;
			$scope.footer = footer;
			//$scope.session = Session;
			$scope.toggleLeft = function()
			{
				$ionicSideMenuDelegate.toggleLeft();
			};
			
			$scope.tabSelect = function(selected)
			{
				console.log("Tab Selected...",selected);
				//$(".main-tab").removeClass("tab-item-active");
				//$("#"+selected).addClass("tab-item-active");
				if(selected == "moreTab" && $ionicSideMenuDelegate.isOpenLeft())
				{
					$ionicSideMenuDelegate.toggleLeft();
				} else {
					$location.path(selected);
				}
			};
			
			$scope.saveConfigurationSession = function()
			{
				console.log("downloading file...");
				$scope.isDownloadReady = false;
				header.setLoading(true);
		           //var urlStr =  generateUrlString("session~"+Session.getId()+'~serializedSession');
				var urlStr ="https://"+BACKEND().ENDPOINT_URL+"/session/"+Session.getId()+"/serializedSession";
		           //window.open(urlStr);
		             $http({
		            	 method: 'get', 
		            	 url : urlStr,
		            	 responseType : "blob",
		            	 headers: {
		            	        'Content-Type': 'application/x-www-form-urlencoded'
		            	    }
		             }).then(function(response) {
		            	//console.log("data downloaded ",response.data);
		            	$scope.isDownloadReady = true;
		            	header.setLoading(false);
		            	var blob = new Blob([ response.data ], { type : 'application/zip' });
		            	$scope.url = (window.URL || window.webkitURL).createObjectURL( blob );
		               	console.log($scope.url);
		       		 });
			}
			
			$scope.hideLink = function(selected)
			{
				$scope.isCFRDownloadReady = false;
				$scope.isDownloadReady = false;
				this.tabSelect(selected);
			}
			$scope.generateCFR = function()
			{
				console.log("creating cfr...");
				$scope.isCFRDownloadReady = false;
				header.setLoading(true);
				var urlStr ="https://"+BACKEND().ENDPOINT_URL+"/session/"+Session.getId()+"/plugins/CFReport/generate";
				//var urlStr ="http://"+BACKEND().ENDPOINT_URL+":"+BACKEND().ENDPOINT_PORT+"/session/"+Session.getId()+"/plugins/CFReport/generate";
		           //window.open(urlStr);
		             $http({
		            	 method: 'get', 
		            	 url : urlStr,
		            	 responseType : "blob",
		            	 headers: {
		            	        'Content-Type': 'application/x-www-form-urlencoded'
		            	    }
		             }).then(function(response) {
		            	//console.log("data downloaded ",response.data);
		            	$scope.isCFRDownloadReady = true;
		            	header.setLoading(false);
		            	var blob = new Blob([ response.data ], { type : 'application/zip' });
		            	$scope.url = (window.URL || window.webkitURL).createObjectURL( blob );
		            	console.log($scope.url);
		            }, function(err) {
		                console.error('ERR', err);
		            	header.setLoading(false);
		              });
			}

			$scope.viewJSONChanged = function()
			{
				$scope.viewJSON = !$scope.viewJSON;
				header.setShowJSON($scope.viewJSON);
				console.log("view JSON..." + $scope.viewJSON);
				if($ionicSideMenuDelegate.isOpenLeft())
				{
					$ionicSideMenuDelegate.toggleLeft();
				} 
			};

			$scope.viewJSON = header.showJSON();
			
			$scope.hasSession = function()
			{
				return Session.hasSession();
			};

			$scope.isConfigurable = function()
			{
				return Session.hasCustomizationData();
			};
			
			$scope.exit = function() 
			{
				console.log("exit", ionic.Platform);
				//Session.close();
				$location.path("config/startOver");
				ionic.Platform.exitApp();
			}

			$scope.showExit = function() 
			{
				return true;//ionic.Platform.isWebView();			
			}

			$scope.hasBack = function()
			{
				return header.hasBack();
			};

			$scope.goBack = function() {
				$location.path(header.back());
			}
			//$scope.isLoading = true;

		}		
	);