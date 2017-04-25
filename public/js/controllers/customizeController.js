app.controller('customizeController',
		function($ionicScrollDelegate,$ionicPopup,$scope,$stateParams,$location,processResponseOnWizardService,customizeDataService2,Session,updateControlService,updateCustomizeScopeService,buildPanelItemList,getItemFromArrayByKeyValue2,header,footer,busyIndicator)
		{
			
		$scope.header = header;
		header.setStatus(5);
		$scope.footer = footer;
		footer.setVisability(true);
		footer.setScope($scope);

		$scope.getCustomizeData = function(sessionID)
			{
				if (sessionID == 0) {
					$location.path("config/intro");
					return;
				}
				
				$scope.setLayout = function() {
					var wizId = $scope.customizeData.ctrl_id_F.toString();
					var panId = $scope.currentPanelData.ctrl_id_F.toString();
					$scope.wizardLayout = "DEFAULT";
					$scope.panelLayout = "DEFAULT";

					if (Session.getLayout().hasOwnProperty(wizId)) {
						$scope.wizardLayout = Session.getLayout()[wizId];
					}
					console.log("wizardLayout",$scope.wizardLayout);
					
					if (Session.getLayout().hasOwnProperty(panId)) {
						$scope.panelLayout = Session.getLayout()[panId];
					
					} 
					console.log("panelLayout",$scope.panelLayout);	
					$scope.panelItems = buildPanelItemList($scope, $scope.currentPanelData.controls, $scope.panelLayout);
					$scope.wizardItems = buildPanelItemList($scope, $scope.customizeData.controls, $scope.wizardLayout);
					$location.path("config/customize");												
				}

				$scope.customizeData = [];
				$scope.currentPanelData = [];
				//$scope.allControls = [];
				$scope.currentPanelIndex = 0;
				$scope.errorMsg = "";
				header.setLoading(false);

				console.log("Calling customizeData Service",$scope);
				customizeDataService2(sessionID, 0).then(function (data)
				{
					console.log("Got Customize Data",data);
					$scope.customizeData = data;					
					$scope.currentPanelData = data.panels[data.currentPanelIndex];
					//$scope.allControls = [$scope.currentPanelData.controls, $scope.customizeData.controls];
					
					$scope.setLayout();
					
					$scope.currentPanelIndex = data.currentPanelIndex;
		    		Session.setCustomizeData(data);
		    		//header.setTitle($scope.customizeData.description);
					$scope.$broadcast('scroll.refreshComplete');
					header.setLoading(false);
					console.log("scope",$scope);
				},
				function(error)
				{
					$scope.errorMsg = "Could not get customize data";
					$scope.$broadcast('scroll.refreshComplete');
					header.setLoading(false);
					
					$ionicPopup.alert({
					       title: error.failureMessage,
					       template: $scope.errorMsg
					     });
					
//					Session.close();
//					$location.path("config/info");

				});
				
			};
			
		
			$scope.isLabel = function(layoutControl) {
				return layoutControl.type == "LTEXT" || layoutControl.type == "GROUPBOX";
			}

			$scope.isControl = function(layoutControl) {
				return layoutControl.type != "LTEXT" && layoutControl.id != "";
			}

			$scope.cmlPanelControl = function(layoutControl) {
				$scope.result = getItemFromArrayByKeyValue2($scope.currentPanelData.controls, "ctrl_id_F",layoutControl.id);
				return $scope.result;
			}

			$scope.cmlWizardControl = function(layoutControl) {
				$scope.result = getItemFromArrayByKeyValue2($scope.customizeData.controls, "ctrl_id_F",layoutControl.id);
				return $scope.result;
			}

			
			var supportedControls = ["Boolean_Control","String_Control","Model_Controlled_Ranged_Float_Control","Date_Control","Singlevalued_Component_Control","Singlevalued_Instance_Control","Multivalued_Component_Control","Table_Component_Control","Command_Control"];
			$scope.supportedControl = function(type) {
				return supportedControls.indexOf(type) > -1;
			}
			
			var footerControls = ["reset_button","cancel_button"];
			$scope.footerControl = function(componentName) {
				return footerControls.indexOf(componentName) > -1;
			}
			
			
			$scope.submitPreviousFirst = function(reqData) {
				if (Session.getControlNeedsUpdate().length > 0) {
					var newReqData = {"controls" : [Session.getControlNeedsUpdate().pop().updateRequest]};
					console.log("previous control",newReqData);
					$scope.nextRequest = reqData;
					return newReqData;
				}
				$scope.nextRequest = "None";
				return reqData;
			}

			$scope.updatePreviousControl = function(id) {					
				var newReqData = $scope.submitPreviousFirst("None");
				//console.log("previous control",newReqData);
				//console.log("id",id);
				//console.log("compId",compId);
				if (newReqData != "None") {
					$scope.updateControl(newReqData);
				}		
			}
			
			$scope.updateControl = function(reqData)
			{
				console.log("updateControl", reqData);
				var newReqData = $scope.submitPreviousFirst(reqData);

				console.log("Calling updateControlService Service",newReqData);
				header.setLoading(true);
					
	
				Session.setMessages([]);	    		
	    		Session.setCurrentPanelID($scope.currentPanelData.id);
				updateControlService(Session.getId(),newReqData).then(function (data)
				{
					
					processResponseOnWizardService.process($scope, data);

//					console.log("Got updateControl Data",data);
//					
//					$scope.$broadcast('scroll.refreshComplete');
//					header.setLoading(false);
//
//					if (data.show == "WIZARD") {
//						updateCustomizeScopeService($scope,data.wizard);
//						Session.setMessages(data.messages);
//
//						$scope.setLayout();
//						
//					}
//					if (data.show == "NONE") {
//						$scope.errorMsg = "";
//				    	Session.setHasCustomizationData(false);
//						$location.path("config/results");						
//					}

				},
				function(error)
				{
					$scope.errorMsg = "Could not updateControl panel";
					$scope.$broadcast('scroll.refreshComplete');
					header.setLoading(false);
					$ionicPopup.alert({
					       title: error.failureMessage,
					       template: $scope.errorMsg
					     });
					
//					Session.close();
//					$location.path("config/info");
				});
				
			};
			
			$scope.messages = function()
			{
				return Session.getMessages();
			}
			
			$scope.selectCommandControl = function(index)
			{
				var reqData = {controls: [{type: $scope.customizeData.controls[index].type, id: $scope.customizeData.controls[index].id}]};
				$scope.updateControl(reqData);

				console.log("selectControl",index);
							
			};

			$scope.selectCommandControl2 = function(control)
			{
				var reqData = {controls: [{type: control.type, id: control.id}]};
				$scope.updateControl(reqData);

				console.log("selectControl",control);
							
			};

			$scope.selectFlowControl = function(index)
			{
				var reqData = {controls: [{type: $scope.customizeData.flowControls[index].type}]};
				$scope.updateControl(reqData);
				//$ionicScrollDelegate.scrollTop();

				console.log("selectFlowControl",index);
							
			};

			$scope.selectPanel = function(index)
			{
				var reqData = {"controls": [{"type" : "Panel_Title_Control", "targetPanelID" : parseInt($scope.customizeData.panels[index].id)}]};
				$scope.updateControl(reqData);
				console.log("selectPanel",index);
							
			};
			
			 
			$scope.header = header;
			$scope.footer = footer;
			footer.setVisability(true);
			footer.setScope($scope);
			$scope.getCustomizeData(Session.getId());

		}

	);


app.controller('labelControlController',
		function($scope)
		{
//	  		$scope.updateControl = function(req) {
//	  			console.log('updateControl', req);
//	  			$scope.$parent.updateControl(req);
//	  		};


			$scope.init = function(layoutControl) {
				console.log("labelControlController ",layoutControl);

				$scope.layoutControl = layoutControl;
				$scope.description = layoutControl.text;
				console.log("$scope.description ", $scope.description);

				if (layoutControl.id !="" && $scope.$parent.cmlPanelControl($scope.layoutControl).result != "None") {
					$scope.control = $scope.$parent.cmlPanelControl($scope.layoutControl).result;
					$scope.description = $scope.control.ctrl_value_S;
					console.log("$scope.control",$scope.control);
				}
				if (layoutControl.id !="" && $scope.$parent.cmlWizardControl($scope.layoutControl).result != "None") {
					$scope.control = $scope.$parent.cmlWizardControl($scope.layoutControl).result;
					$scope.description = $scope.control.ctrl_value_S;
					console.log("$scope.control",$scope.control);
				}
				console.log("$scope.description ",$scope.description);
			}
		}


);

app.controller('panelControlController',
		function($scope)
		{
	
	
//			$scope.updateControl = function(req) {
//				console.log('updateControl', req);
//				$scope.$parent.updateControl(req);
//			};
			
			$scope.init = function(layoutControl) {
//				console.log("panelControlController $scope",$scope);

				$scope.layoutControl = layoutControl;

				if ($scope.$parent.cmlPanelControl($scope.layoutControl).result != "None") {
					$scope.control = $scope.$parent.cmlPanelControl($scope.layoutControl).result;
					console.log("$scope.control",$scope.control);
				}
			}
		}


);

app.controller('wizardControlController',
		function($scope)
		{

//			$scope.updateControl = function(req) {
//				console.log('updateControl', req);
//				$scope.$parent.updateControl(req);
//			};
			
			$scope.init = function(layoutControl) {
//				console.log("panelControlController $scope",$scope);

				$scope.layoutControl = layoutControl;

				if ($scope.$parent.cmlWizardControl($scope.layoutControl).result != "None") {
					$scope.control = $scope.$parent.cmlWizardControl($scope.layoutControl).result;
					console.log("$scope.control",$scope.control);
				}
			}
		}


);

app.controller('singleSelectController',
		function($scope,$ionicModal,getItemFromArrayById)
		{
			
		$scope.description = function(index) {
  			var list = $scope.control.data[index].description;
  			var description = list[0];
  			for (var i = 1; i < list.length; i++) {
  				description = description + " - " + list[i];
  			}
  			//console.log("description",description);
  			return description;
  		};

		$scope.compDescription = function(id) {
			if (id > 0) {
				var comp = getItemFromArrayById($scope.control.data, id);
				var description = comp.description[0];
				for (var i = 1; i < comp.description.length; i++) {
					description = description + " - " + comp.description[i];
				}
				//console.log("description",description);
				return description;
			} else {
				return "None"
			}
  		};
  		
	
 		
			
			$scope.init = function(item) {
//				console.log("singleSelectController $scope",$scope);
//			    $scope.index= index;
//				console.log("$scope.$parent.currentPanelData",$scope.$parent.currentPanelData);
//				console.log("index",index);
				$scope.item = item;
				$scope.control = item.control;
				console.log("$scope.control",$scope.control);
				$scope.selectedDescription = $scope.compDescription($scope.control.ctrl_value_C);
				
				$scope.updateRequest =  {
						"id" : $scope.control.id,
						"type" : $scope.control.type,
						"ctrl_value_C" : $scope.control.ctrl_value_C,
						"isDoubleClick" : false
				}
				
                $ionicModal.fromTemplateUrl(
                        'views/overlay-select-items.html',
                        {'scope': $scope}
                   ).then(function(modal) {
                    	$scope.modal = modal;
                    });

			}
			
			 $scope.showItems = function (event) {
				 console.log("show");
               event.preventDefault();
                $scope.modal.show();
            }
             /* Hide list */
			 $scope.hideItems = function () {
				 console.log("hide");
				 $scope.modal.hide();
             }

             /* Destroy modal */
			 $scope.$on('$destroy', function() {
				 console.log("remove");
               $scope.modal.remove();
             });


			  $scope.selectRow = function(id) {
				  	$scope.updateRequest.ctrl_value_C = id;
				    console.log('selectRow', $scope.updateRequest);
				    $scope.updateControl();
			  };

			
			  $scope.updateControl = function() {
			    console.log('updateControl', $scope.updateRequest);
			    $scope.$parent.updateControl({"controls" : [$scope.updateRequest]});
				$scope.selectedDescription = $scope.compDescription($scope.control.ctrl_value_C);
			  };
		}


);

app.controller('singleSelectInstanceController',
		function($scope)
		{
			
	  		$scope.description = function(index) {
	  			var list = $scope.control.data[index].description;
	  			var description = list[0];
	  			for (var i = 1; i < list.length; i++) {
	  				description = description + " - " + list[i];
	  			}
	  			return description;
	  		};

			
			$scope.init = function(control) {
//				console.log("singleSelectInstanceController $scope",$scope);
//			    $scope.index= index;
//				console.log("$scope.$parent.currentPanelData",$scope.$parent.currentPanelData);
//				console.log("index",index);
				$scope.control = control;
				console.log("$scope.control",$scope.control);

				$scope.updateRequest =  {
						"id" : $scope.control.id,
						"type" : $scope.control.type,
						"ctrl_value_CI" : $scope.control.ctrl_value_CI,
						"isDoubleClick" : false
				}
			}
			
			  $scope.selectRow = function(id) {
				  	$scope.updateRequest.ctrl_value_CI = id;
				    console.log('selectRow', $scope.updateRequest);
				    $scope.updateControl();
			  };

			  $scope.updateControl = function() {
			    console.log('updateControl', $scope.updateRequest);
			    $scope.$parent.updateControl({"controls" : [$scope.updateRequest]});
			  };
		}


);

app.controller('multiSelectController',
		function($scope)
		{
			
	$scope.init = function(control) {
//		console.log("multiSelectController $scope",$scope);
//	    $scope.index= index;
//		console.log("$scope.$parent.currentPanelData",$scope.$parent.currentPanelData);
//		console.log("index",index);
		$scope.control = control;
		console.log("$scope.control",$scope.control);

		$scope.updateRequest =  {
				"id" : $scope.control.id,
				"type" : $scope.control.type,
				"componentID" : ""
		}
		
		for (i = 0; i < $scope.control.data.length; i++) { 
			$scope.control.data[i]["selected"] = $scope.selected($scope.control.data[i].id);
		}
	}
	
	$scope.selected = function(compId) {
		return $scope.control.ctrl_value_mC.indexOf(compId) > -1;
	}
	
	  $scope.updateControl = function(compId) {
		$scope.updateRequest["componentID"] = compId;
	    console.log('updateControl', $scope.updateRequest);
	    $scope.$parent.updateControl({"controls" : [$scope.updateRequest]});
	  };

		}


);

app.controller('tableSelectController',
		function($scope, Session, getItemFromArrayById)
		{
			
			
			$scope.init = function(control) {
//				console.log("tableSelectController $scope",$scope);
//			    $scope.index= index;
//				console.log("$scope.$parent.currentPanelData",$scope.$parent.currentPanelData);
//				console.log("index",index);
				$scope.control = control;
				
				for (i = 0; i < $scope.control.data.length; i++) { 
					$scope.control.data[i]["changed"] = false;
				}

				console.log("$scope.control",$scope.control);


				$scope.updateRequest =  {
						"id" : $scope.control.id,
						"type" : $scope.control.type,
						"componentID" : "",
						"quantity" : 0				
				}
			}
			

			$scope.changed = false;
			
			$scope.updatePreviousControl = function(id, compId) {					
				if ($scope.updateRequest.id != id || $scope.updateRequest.componentID != compId) {
					$scope.$parent.updatePreviousControl(id);
				}		
			}

			$scope.changeControl = function(index) {
				$scope.control.data[index]["changed"] = true;
		    	$scope.updateRequest["componentID"] = $scope.control.data[index].id;
		    	$scope.updateRequest["quantity"] = $scope.control.data[index].quantity;
			    console.log('value', $scope.control.data[index].quantity);
			    if (!$scope.changed) {
			    	Session.setControlNeedsUpdate($scope);
			    	$scope.changed = true;
			    }
			}
			
			  $scope.updateControl = function(index) {
				  console.log('updateControl', index);
					//$scope.updateRequest["componentID"] = compId;
					//$scope.updateRequest["quantity"] = getItemFromArrayById($scope.control.data, compId).quantity;
				  
				    if ($scope.changed) {
				    	Session.getControlNeedsUpdate().pop();
				    	$scope.changed = false;
				    }
				    if ($scope.control.data[index]["changed"]) {
				    	console.log('updateControl', $scope.updateRequest);
				    	$scope.$parent.updateControl({"controls" : [$scope.updateRequest]});
				    }
				  };
				  
			$scope.compDescription = function(index) {
				//console.log('$scope.control.data[index]', $scope.control.data[index]);
				//console.log('$scope.control.data[index].decription', $scope.control.data[index].description);
				if ($scope.control.data[index].description.length > 1) {
					return $scope.control.data[index].description[1];
				}
				return $scope.control.data[index].description[0];
			 };
		}


);

app.controller('rangeFloatController',
		function($scope, Session)
		{
			$scope.changed = false;
			$scope.init = function(control) {
//				console.log("rangeFloatController $scope",$scope);
				$scope.control = control;
				console.log("$scope.control",$scope.control);


				$scope.updateRequest =  {
					"id" : $scope.control.id,
					"type" : $scope.control.type,
					"ctrl_value_F" : $scope.control.ctrl_value_F
				}
			}
	
			$scope.updatePreviousControl = function(id) {					
				if ($scope.updateRequest.id != id) {
					$scope.$parent.updatePreviousControl(id);
				}		
			}

			$scope.changeControl = function() {
			    console.log('value', $scope.updateRequest.ctrl_value_F);
			    if (!$scope.changed) {
			    	Session.setControlNeedsUpdate($scope);
			    	$scope.changed = true;
			    }
			};

			$scope.updateControl = function() {
			    console.log('updateControl', $scope.updateRequest);
			    if ($scope.changed) {
			    	Session.getControlNeedsUpdate().pop();
			    	$scope.changed = false;
			    }
			    $scope.$parent.updateControl({"controls" : [$scope.updateRequest]});
			};
}


);
app.controller('stringSelectController',
		function($scope, Session)
		{
			$scope.changed = false;
			$scope.init = function(control) {
//				console.log("stringSelectController $scope",$scope);
//				$scope.index= index;
//				console.log("$scope.$parent.currentPanelData",$scope.$parent.currentPanelData);
//				console.log("index",index);
				$scope.control = control;
				console.log("$scope.control",$scope.control);


				$scope.updateRequest =  {
					"id" : $scope.control.id,
					"type" : $scope.control.type,
					"ctrl_value_S" : $scope.control.ctrl_value_S
				}
			}
	
			$scope.changeControl = function() {
			    console.log('value', $scope.updateRequest.ctrl_value_S);
			    if (!$scope.changed) {
			    	Session.setControlNeedsUpdate($scope);
			    	$scope.changed = true;
			    }
			};

			$scope.updateControl = function() {
			    console.log('updateControl', $scope.updateRequest);
			    if ($scope.changed) {
			    	Session.getControlNeedsUpdate().pop();
			    	$scope.changed = false;
			    }
			    $scope.$parent.updateControl({"controls" : [$scope.updateRequest]});
			};
}


);

app.controller('booleanSelectController',
		function($scope)
		{
			
			$scope.init = function(control) {
				//console.log("booleanSelectController $scope",$scope);
				//console.log("$scope.$parent.currentPanelData",$scope.$parent.currentPanelData);
				//console.log("control",control);
				//console.log("index",index);
				$scope.control = control;
//				console.log("$scope.control",$scope.control);


				$scope.updateRequest =  {
					"id" : $scope.control.id,
					"type" : $scope.control.type,
					"ctrl_value_B" : $scope.control.ctrl_value_B
				}
			}
	
			$scope.updateControl = function() {
			    console.log('updateControl', $scope.updateRequest);
			    $scope.$parent.updateControl({"controls" : [$scope.updateRequest]});
			};
}


);

app.controller('dateSelectController',
		function($scope)
		{
			
			$scope.init = function(control) {
//				console.log("dateSelectController $scope",$scope);
//				$scope.index= index;
				$scope.control = control;
				console.log("$scope.control",$scope.control);


				$scope.updateRequest =  {
					"id" : $scope.control.id,
					"type" : $scope.control.type,
					"ctrl_value_D" : $scope.control.ctrl_value_D
				}
				
				var dateData = $scope.control.ctrl_value_D.split("T")[0].split("-");
				var date = new Date();
				console.log("date",date);
				$scope.date = new Date();
				console.log("$scope.date",$scope.date);
				$scope.date.setFullYear(dateData[0]);
				$scope.date.setMonth(dateData[1]-1);
				$scope.date.setDate(dateData[2]);
				
				//$scope.time = date[1];
				//console.log("$scope.control.ctrl_value_D",$scope.control.ctrl_value_D);
				console.log("$scope.date",$scope.date);
				//console.log("$scope.time",$scope.time);
			}
	
			$scope.updateControl = function() {
				$scope.updateRequest["ctrl_value_D"] = $scope.date.toISOString()
			    console.log('updateControl', $scope.updateRequest);
			    
			    $scope.$parent.updateControl({"controls" : [$scope.updateRequest]});
			};
}


);