app.controller('customizeController',
	function($ionicPopup,$scope,$stateParams,$location,customizeDataService2,Session,header,footer,busyIndicator)
	{
		$scope.header = header;
		header.setHasBack(false);

		console.log("customizeController",$scope);
		$scope.getCustomizeData = function(sessionID)
		{
			if (sessionID == 0) {
				$location.path("other");
				return;
			}
			
			var wizardID = 0;
			console.log("$stateParams",$stateParams);
			if (Boolean(Object.keys($stateParams).length)) {
				wizardID = $stateParams.id;
			} 

			$scope.customizeData = [];
			$scope.currentPanelData = [];
			$scope.currentPanelIndex = 0;
			$scope.errorMsg = "";
			busyIndicator.show();
			header.isLoading = true;
			console.log("Calling customizeData Service",$scope);
			customizeDataService2(sessionID, wizardID).then(function (data)
			{
				console.log("Got Customize Data",data);
				$scope.customizeData = data;					
				

				$scope.currentPanelData = data.panels[data.currentPanelIndex];
				
				$scope.json = JSON.stringify($scope.currentPanelData, null, 3);

				$scope.currentPanelIndex = data.currentPanelIndex;
	    		Session.setCustomizeData(data);
	    		Session.setHasCustomizationData(true);
	    		header.setTitle($scope.customizeData.componentName);
				$scope.$broadcast('scroll.refreshComplete');
				busyIndicator.hide();
				header.isLoading = false;
				$scope.errorMsg = "";
			},
			function(error)
			{
				$scope.errorMsg = "Could not get customize data";
				$scope.$broadcast('scroll.refreshComplete');
				busyIndicator.hide();
				header.isLoading = false;
				//$scope.showAlert('Don\'t eat that!','It might taste good');
				$ionicPopup.alert({
				       title: error.failureMessage,
				       template: $scope.errorMsg
				     });
				
				Session.close();
				$location.path("config/info");
			});
		};
		
	     
		$scope.messages = function()
		{
			return Session.getMessages();
		}
		
		$scope.getCustomizeData(Session.getId());
		console.log("customizeController",$scope);
	
		$scope.selectFlowControl = function(index)
		{

			header.isLoading = true;
			Session.setMessages([]);

			console.log("selectFlowControl",index);
						
		};


		$scope.selectControl = function(index)
		{

			header.isLoading = true;
			Session.setMessages([]);

			console.log("selectControl",index);
						
		};

		$location.path("config/panel");

	}		
);

app.controller('selectPanelController',
		function($ionicPopup,$scope,$stateParams,$location,updateControlService,Session,header,footer,busyIndicator)
		{
			console.log("selectPanelController",$scope);
			$scope.selectPanel = function(panelId)
			{

				
				header.isLoading = true;
				var reqData = {"controls": [{"type" : "Panel_Title_Control", "targetPanelID" : parseInt(panelId)}]};
				console.log("Calling updateControlService Service",reqData);
							
				console.log("Calling updateControlService Service",$scope);
				Session.setMessages([]);
				updateControlService(Session.getId(),reqData).then(function (data)
				{
					console.log("Got updateControl Data",data);
					$scope.$broadcast('scroll.refreshComplete');
					busyIndicator.hide();
					header.isLoading = false;
					$scope.errorMsg = "";
					$location.path("config/panel");
				},
				function(error)
				{
					$scope.errorMsg = "Could not select panel";
					$scope.$broadcast('scroll.refreshComplete');
					busyIndicator.hide();
					header.isLoading = false;
					$ionicPopup.alert({
					       title: error.failureMessage,
					       template: $scope.errorMsg
					     });
					
					Session.close();
					$location.path("config/info");
				});
			};
			
			$scope.selectPanel($stateParams.id);
			console.log("selectPanel",$scope);
		}		
	);

app.controller('selectFlowControlController',
		function($ionicPopup,$scope,$stateParams,$location,updateControlService,updateCustomizeScopeService,Session,header,footer,busyIndicator)
		{
			console.log("selectFlowControlController",$scope);
			$scope.selectDone = function(type)
			{

				header.isLoading = true;
				Session.setMessages([]);

				var reqData = {controls: [{type: type}]};
				console.log("Calling selectFlowControlController Service",reqData);
							
				console.log("Calling selectFlowControlController Service",$scope);
				updateControlService(Session.getId(),reqData).then(function (data)
				{
					console.log("Got selectFlowControlController Data",data);
					if (data.show == "WIZARD") {
						Session.setMessages(data.messages);
						$location.path("config/customize");												
					}
					if (data.show == "NONE") {
						$scope.errorMsg = "";
				    	Session.setHasCustomizationData(false);
						$location.path("config/results");						
					}
					$scope.$broadcast('scroll.refreshComplete');
					busyIndicator.hide();
					header.isLoading = false;

				},
				function(error)
				{
					$scope.errorMsg = "Could not selectFlowControlController";
					$scope.$broadcast('scroll.refreshComplete');
					busyIndicator.hide();
					header.isLoading = false;
					$ionicPopup.alert({
					       title: error.failureMessage,
					       template: $scope.errorMsg
					     });
					
					Session.close();
					$location.path("config/info");
				});
			};
			
			$scope.selectDone($stateParams.type);
			console.log("selectPanel",$scope);
		
		}		
	);


