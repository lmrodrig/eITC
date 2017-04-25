app.factory("updateControlService", function($http, $q, $routeParams, generateUrlString) {
	return function(sessionID, reqData) {

		var deferred = $q.defer();

		$http.post(generateUrlString("session~" + sessionID + "~currentWizard~updateControl"), reqData).success(function(data) {
			deferred.resolve(data);
		}).error(function(data) {
			deferred.reject(data);
		});
		return deferred.promise;

	};
});

app.factory("wizardViewEventService", function($http, $q, $routeParams, generateUrlString) {
	return function(sessionID, reqData) {

		var deferred = $q.defer();

		$http.post(generateUrlString("session~" + sessionID + "~wizardView~event"), reqData).success(function(data) {
			deferred.resolve(data);
		}).error(function(data) {
			deferred.reject(data);
		});
		return deferred.promise;

	};
});

app.factory("messageViewEventService", function($http, $q, $routeParams, generateUrlString) {
	return function(sessionID, reqData) {

		var deferred = $q.defer();

		$http.post(generateUrlString("session~" + sessionID + "~messageView~event"), reqData).success(function(data) {
			deferred.resolve(data);
		}).error(function(data) {
			deferred.reject(data);
		});
		return deferred.promise;

	};
});

app.factory("userInputService", function($http, $q, $routeParams, generateUrlString) {
	return function(sessionID, reqData) {

		var deferred = $q.defer();

		$http.post(generateUrlString("session~" + sessionID + "~userInput"), reqData).success(function(data) {
			deferred.resolve(data);
		}).error(function(data) {
			deferred.reject(data);
		});
		return deferred.promise;

	};
});

app.factory("updateCustomizeScopeService", function(Session, header) {
	return function($scope, data) {
		console.log("updateCustomizeScopeService $scope",$scope);
		console.log("updateCustomizeScopeService data",data);
		$scope.customizeData = data;					
		$scope.currentPanelData = data.panels[data.currentPanelIndex];
		
		$scope.wizardLayout = Session.getLayout()[$scope.customizeData.ctrl_id_F.toString()];
		console.log("wizardLayout",$scope.wizardLayout);
		$scope.panelLayout = Session.getLayout()[$scope.currentPanelData.ctrl_id_F.toString()];
		console.log("panelLayout",$scope.panelLayout);

		$scope.currentPanelIndex = data.currentPanelIndex;
		Session.setCustomizeData(data);
		Session.setHasCustomizationData(true);
		//header.setTitle($scope.customizeData.componentName);

	};
});

app.factory("processResponseService", function($location,$ionicPopup, Session, userInputService, header) {
	
	var processReq = {};
	
	processReq.process = function($scope, data) {
		console.log("processResponseService $scope",$scope);
		console.log("processResponseService data",data);
		header.setLoading(false);
		if (data.show == "WIZARD") {
			$location.path("config/customize");	
			$scope.needsRefresh = true;
			console.log('needsRefresh!', $scope);
		}
		if (data.show == "NONE") {
			$scope.errorMsg = "";
			Session.setHasCustomizationData(false);
			if(data.messages.length > 0) {
				$ionicPopup.alert({
					title: data.messages[0].severity + " Message",
					template: data.messages[0].text
				});
			}

			if (data.refreshViews) {
				header.setLoading(true);
				$scope.refreshViews(true);
			} else {
				$scope.refreshViews(false);
			}
			$location.path("config/results/" + header.getLastResultPage());						
		}
		if (data.show == "USER_INPUT") {
			$scope.errorMsg = data.query.text;
			var myPopup = $ionicPopup.confirm({
				    title: data.query.title,
				    subTitle: $scope.errorMsg,
				  });
			myPopup.then(function(res) {
			    //console.log('Tapped!', res);
				Session.setHasCustomizationData(false);
					//userInputService(Session.getId(), { "type" : data.query.type , "value" : res ? data.query.trueLabel : data.query.falseLabel}).then(function (ucData) {
					userInputService(Session.getId(), { "type" : data.query.type , "value" : res }).then(function (ucData) {
					processReq.process($scope, ucData);
					},
					function(error)
					{
						$scope.errorMsg = "Could not process response";
						$scope.$broadcast('scroll.refreshComplete');
						header.setLoading(false);
						$ionicPopup.alert({
							title: error.failureMessage,
							template: $scope.errorMsg
						});
				
					});		
				});
			}
	};
	return processReq;

});

app.factory("processResponseOnWizardService", function($timeout,$ionicScrollDelegate,$location,$ionicPopup, Session, updateCustomizeScopeService, userInputService, header) {
	
	var processReq = {};
	
	processReq.process = function($scope, data) {
		console.log("processResponseOnWizardService",data);
		$scope.$broadcast('scroll.refreshComplete');
		header.setLoading(false);

		if (data.show == "WIZARD") {
			updateCustomizeScopeService($scope,data.wizard);
			Session.setMessages(data.messages);
			$scope.setLayout();
			
			if(data.messages.length > 0) {
				$ionicPopup.alert({
					title: data.messages[0].severity + " Configuration Message",
					template: data.messages[0].text
				});
				
				var status = 1;
				if (data.messages[0].severity == "WARNING") {
					status = 3;
				} else if (data.messages[0].severity == "INFO") {
					status = 4;
				}
				header.setStatus(status);
				
				
			} else if ($scope.nextRequest != "None") {
				var reqData = $scope.nextRequest;
				$scope.updateControl(reqData);				
			}
			
			console.log('should we scroll to top? ' + Session.getCurrentPanelID() +  " - " + $scope.currentPanelData.id , $scope);
			if (Session.getCurrentPanelID() != $scope.currentPanelData.id) {
//				$ionicPlatform.ready(function () {
//				    $ionicScrollDelegate.scrollTop();
//				})
				$timeout(function() {
					$ionicScrollDelegate.scrollTop();
				}, 0);
				
				console.log('yes,  scroll to top');
			}

		}
		if (data.show == "NONE") {
			$scope.errorMsg = "";
	    	Session.setHasCustomizationData(false);
			$location.path("config/results/" + header.getLastResultPage());						
		}
		if (data.show == "USER_INPUT") {
			$scope.errorMsg = data.query.text;
			var myPopup = $ionicPopup.confirm({
			    title: data.query.title,
			    subTitle: $scope.errorMsg,
			});
			myPopup.then(function(res) {
			    //console.log('Tapped!', res);
				Session.setHasCustomizationData(false);
					//userInputService(Session.getId(), { "type" : data.query.type , "value" : res ? data.query.trueLabel : data.query.falseLabel}).then(function (ucData) {
					userInputService(Session.getId(), { "type" : data.query.type , "value" : res }).then(function (ucData) {
					processReq.process($scope, ucData);
					},
					function(error)
					{
						$scope.errorMsg = "Could not process response";
						$scope.$broadcast('scroll.refreshComplete');
						header.setLoading(false);
						$ionicPopup.alert({
							title: error.failureMessage,
							template: $scope.errorMsg
						});
				
					});		
				});
			}
	};
	return processReq;

});


app.factory("buildPanelItemList", function(getItemFromArrayByKeyValue2,Session) {
	return function($scope, controls, layout) {
		
		
		var defaultLayout = function() {
			for (i = 0; i < controls.length; i++) {
				layoutControls.push({"id": controls[i].ctrl_id_F, "type" : "CONTROL", "text" : controls[i].displayName.substr(controls[i].displayName.indexOf(" ") + 1)});
			}
	
		};

		var setType = function(item) {
			if (item.layout.type == "LTEXT") {
				item.type = "Label";
			} else if (item.layout.type == "GROUPBOX"){
				item.type = "Group";
			} else if (item.layout.id != ""){
				item.type = "Control";
			} else {
				item.type = "UNKNOWN";
			}
		};

		var setPanelControl = function(item) {
			if (item.layout.id != "") {
				item["control"] = getItemFromArrayByKeyValue2(controls, "ctrl_id_F", item.layout.id).result;
			} else {
				item["control"] = "None";
			}
		};

		var setDescription = function(item) {
			if (item.type == "Label") {
				if (item.control == "None") {
					item["description"] = item.layout.text.replace('&','');								
				} else {
					if (item.control.description.length > 0) {
						item["description"] = item.control.description;
					} else {
						item["description"] = item.control.ctrl_value_S;
					}
				}
			} else if (item.type == "Control") {
				if (item.layout.hasOwnProperty('text') && item.layout.text.length > 0) {
					item["description"] = item.layout.text.replace('&','')								
				} else {
					if (item.control != "None") {
						item["description"] = item.control.displayName.substr(item.control.displayName.indexOf(" ") + 1);	
					} 
				}
			} else {
				item["description"] = item.layout.text.replace('&','');												
			}

			if (panelItems.length > 0) {
				item["hasLabel"] = panelItems[panelItems.length - 1].type == "Label";
			} else {
				item["hasLabel"] = false
			}
			if (item["hasLabel"]) {
				item["label"] = panelItems[panelItems.length - 1].description;
			} else {
				item["label"] = item.description;
			}

		}

		var setVisability = function(item) {
			if (item.type == "Label" || item.type == "Group") {
				if (item.control == "None") {
					item["visable"] = true;								
				} else {
					item["visable"] = item.control.visible_B;								
				}
			} else if (item.control != "None") {
				item["visable"] = item.control.visible_B && item.control != "None";
			} else {
				item["visable"] = false;
			}
			
		}

		var setAdditionalMetaData = function(item) {
			//console.log("set additionalMetaData");
			if (item.control != "None") {
				//console.log("set additionalMetaData", item.control);
				//console.log("Session.getAdditionalMetaData()", Session.getAdditionalMetaData());
				if (Session.getAdditionalMetaData().hasOwnProperty(item.control.componentName)) {
					item.layout["additionalMetaData"] = Session.getAdditionalMetaData()[item.control.componentName];
					console.log("set additionalMetaData", item);
				}
			}
		}

		console.log("buildPanelItemList $scope",$scope);
		 var panelItems = [];
		 
		 var layoutControls = [];
		 if (layout == "DEFAULT") {
			 defaultLayout();	
		 } else {
			 layoutControls = layout.controls; 
		 }
		
		for (i = 0; i < layoutControls.length; i++) {
			var layout = layoutControls[i];
			var item = {};
			item["layout"] = layout;
			item["inGroup"] = false;
			setType(item);
			setPanelControl(item);
			setDescription(item);
			setVisability(item);
			setAdditionalMetaData(item);
			panelItems.push(item);
			if (item.type == "Group") {
				item["inGroup"] = true;
				for (j = 0; j < layout.controls.length; j++) {
					var nestedLayout = layout.controls[j];
					var nestedItem = {};
					nestedItem["layout"] = nestedLayout;
					nestedItem["inGroup"] = true;
					nestedItem["hasLabel"] = panelItems[panelItems.length - 1].type == "Label";
					setType(nestedItem);
					setPanelControl(nestedItem);
					setDescription(nestedItem);
					setVisability(nestedItem);
					setAdditionalMetaData(nestedItem);
					panelItems.push(nestedItem);
				}
			}
		}
		
		return panelItems;
	};
});


