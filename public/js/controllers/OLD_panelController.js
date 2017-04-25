//app.controller('panelController',
//				function($ionicScrollDelegate,$ionicPopup,$scope,$stateParams,$location,customizeDataService2,Session,updateControlService,updateCustomizeScopeService,header,footer,busyIndicator)
//				{
//					$scope.header = header;
//					$scope.footer = footer;
//					footer.setVisability(true);
//					footer.setScope($scope);
//					console.log("panelController",$scope);
//					$scope.getCustomizeData = function(sessionID)
//					{
//						if (sessionID == 0) {
//							$location.path("other");
//							return;
//						}
//						
//
//						$scope.customizeData = [];
//						$scope.currentPanelData = [];
//						$scope.allControls = [];
//						$scope.currentPanelIndex = 0;
//						$scope.errorMsg = "";
//						header.setLoading(true);
//
//						console.log("Calling customizeData Service",$scope);
//						customizeDataService2(sessionID, 0).then(function (data)
//						{
//							console.log("Got Customize Data",data);
//							$scope.customizeData = data;					
//							
//
//							$scope.currentPanelData = data.panels[data.currentPanelIndex];
//							$scope.allControls = [$scope.currentPanelData.controls, $scope.customizeData.controls];
//							
//							$scope.json = JSON.stringify($scope.currentPanelData, null, 3);
//
//							$scope.currentPanelIndex = data.currentPanelIndex;
//				    		Session.setCustomizeData(data);
//				    		//header.setTitle($scope.customizeData.description);
//							$scope.$broadcast('scroll.refreshComplete');
//							header.setLoading(false);
//
//							$scope.errorMsg = "";
//						},
//						function(error)
//						{
//							$scope.errorMsg = "Could not get customize data";
//							$scope.$broadcast('scroll.refreshComplete');
//							header.setLoading(false);
//							
//							$ionicPopup.alert({
//							       title: error.failureMessage,
//							       template: $scope.errorMsg
//							     });
//							
//							Session.close();
//							$location.path("config/info");
//
//						});
//					};
//					
//				
//					$scope.getCustomizeData(Session.getId());
//					console.log("customizeController",$scope);
//				
////					$scope.goBack = function() {
////						$location.path("config/customize");
////					}
////					header.setBack("config/customize");
//					
//					var supportedControls = ["Boolean_Control","String_Control","Date_Control","Singlevalued_Component_Control","Singlevalued_Instance_Control","Multivalued_Component_Control","Table_Component_Control","Command_Control"];
//					$scope.supportedControl = function(type) {
//						return supportedControls.indexOf(type) > -1;
//					}
//					
//					var footerControls = ["reset_button","cancel_button"];
//					$scope.footerControl = function(componentName) {
//						return footerControls.indexOf(componentName) > -1;
//					}
//
//					$scope.updateControl = function(reqData)
//					{
//
//						console.log("Calling updateControlService Service",reqData);
//						header.setLoading(true);
//						updateControlService(Session.getId(),reqData).then(function (data)
//						{
//							console.log("Got updateControl Data",data);
//							
//							$scope.$broadcast('scroll.refreshComplete');
//							header.setLoading(false);
//
//							if (data.show == "WIZARD") {
//								updateCustomizeScopeService($scope,data.wizard);
//								Session.setMessages(data.messages);
//								$location.path("config/customize");												
//							}
//							if (data.show == "NONE") {
//								$scope.errorMsg = "";
//						    	Session.setHasCustomizationData(false);
//								$location.path("config/results");						
//							}
//
//						},
//						function(error)
//						{
//							$scope.errorMsg = "Could not updateControl panel";
//							$scope.$broadcast('scroll.refreshComplete');
//							header.setLoading(false);
//							$ionicPopup.alert({
//							       title: error.failureMessage,
//							       template: $scope.errorMsg
//							     });
//							
//							Session.close();
//							$location.path("config/info");
//						});
//					};
//					
//					$scope.messages = function()
//					{
//						return Session.getMessages();
//					}
//					
//					$scope.selectCommandControl = function(index)
//					{
//
//						Session.setMessages([]);
//						var reqData = {controls: [{type: $scope.customizeData.controls[index].type, id: $scope.customizeData.controls[index].id}]};
//						$scope.updateControl(reqData);
//
//						console.log("selectControl",index);
//									
//					};
//
//					$scope.selectCommandControl2 = function(control)
//					{
//
//						Session.setMessages([]);
//						var reqData = {controls: [{type: control.type, id: control.id}]};
//						$scope.updateControl(reqData);
//
//						console.log("selectControl",control);
//									
//					};
//
//					$scope.selectFlowControl = function(index)
//					{
//
//						Session.setMessages([]);
//						var reqData = {controls: [{type: $scope.customizeData.flowControls[index].type}]};
//						$scope.updateControl(reqData);
//						$ionicScrollDelegate.scrollTop();
//
//						console.log("selectFlowControl",index);
//									
//					};
//
//					$scope.selectPanel = function(index)
//					{
//
//						Session.setMessages([]);
//						var reqData = {"controls": [{"type" : "Panel_Title_Control", "targetPanelID" : parseInt($scope.customizeData.panels[index].id)}]};
//						$scope.updateControl(reqData);
//						console.log("selectPanel",index);
//									
//					};
//
//				}
//
//			);

