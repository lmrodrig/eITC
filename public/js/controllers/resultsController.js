
app.controller('resultsController',
	function($ionicPopup, $scope,$stateParams,$location,wizardViewEventService,messageViewEventService,processResponseService,header,footer,Session,partsListService,addPartService,wizardListService,wizardEventService,messagesService,quotesService,getItemFromArrayByKeyValue)
	{
		$scope.header = header;
		$scope.footer = footer;
		console.log("resultsController",$scope);

		$scope.refreshViews = function(flag) {
			header.setHasBack(false);
			footer.setVisability(false);
			if (flag) {
				$scope.needsRefresh = true;	
			} else {
				return;
			}
			console.log("refreshViews ");
			if ($scope.hasOwnProperty("editView")) {
				console.log("refreshViews editView");
				$scope.editView.getWizardList(Session.getId());
			}
			if ($scope.hasOwnProperty("catalogView")) {
				console.log("refreshViews catalogView");
				$scope.catalogView.getPartsList(Session.getId());
			}
			if ($scope.hasOwnProperty("messageView")) {
				console.log("refreshViews messageView");
				$scope.messageView.getMessages(Session.getId());
			}
			if ($scope.hasOwnProperty("summaryView")) {
				console.log("refreshViews summaryView");
				$scope.summaryView.getQuote(Session.getId());
			}
			if ($scope.hasOwnProperty("diagramView")) {
				console.log("refreshViews diagramView");
				$scope.diagramView.getDiagram(Session.getId());
			}
		}
		
		$scope.setEditView = function(viewScope) {
			$scope.editView = viewScope;
		}

		$scope.setCatalogView = function(viewScope) {
			$scope.catalogView = viewScope;
		}

		$scope.setMessageView = function(viewScope) {
			$scope.messageView = viewScope;
		}

		$scope.setSummaryView = function(viewScope) {
			$scope.summaryView = viewScope;
		}

		$scope.setDiagramView = function(viewScope) {
			$scope.diagramView = viewScope;
		}

		//var validActions = ["interactive_edit", "interactive_delete_wizard", "interactive_duplicate_wizard","sq_interactive_mass_feature_event"]
		$scope.validAction = function(action) {
			return action.group_F != 90 && action.sb_enabled_event_B;
			//return validActions.indexOf(action.name) > -1 && action.sb_enabled_event_B;
		}
		
		$scope.filteredAction = function(action) {
			return action.group_F != 90 && action.sb_enabled_event_B;
			//return validActions.indexOf(action.name) > -1 && action.sb_enabled_event_B;
		}
		
		$scope.needsRefresh = false;
		
		
	}		
);

app.controller('catalogController',
		function($ionicPopup, $scope,$stateParams,$location,wizardViewEventService,messageViewEventService,processResponseService,header,footer,Session,partsListService,addPartService,wizardListService,wizardEventService,messagesService,quotesService,getItemFromArrayByKeyValue)
		{
			
			$scope.getPartsList = function(sessionID)
			{
				$scope.statusMsg = "";
				if (sessionID == 0) {
					$location.path("config/other");
					return;
				}


				
				partsListService(sessionID).then(function(response)
				{
					Session.clearAllCrumbs();
					$scope.dataStack = [];
					var responsePartList = response.partsList
					Session.sortPartNumbers(responsePartList,'partslist_sort_order_F');
					$scope.partsList = responsePartList;
					$scope.displayList = $scope.partsList;
					$scope.dataStack.push($scope.partsList);
					$scope.partsListJson = JSON.stringify(response, null, 3);
					$scope.errorMsg = response.failureMessage;
					
					Session.addCrumbs($scope.partsList);
					$scope.breadcrumbs = Session.getCrumbs();				
					$scope.$broadcast('scroll.refreshComplete');
					header.setLoading(false);
					$scope.needsRefresh = false;
				},
				function(error)
				{
					$scope.errorMsg = "Could not get parts List";
					$scope.$broadcast('scroll.refreshComplete');
					header.setLoading(false);
					$ionicPopup.alert({
					       title: 'Error!',
					       template: error.failureMessage
					     });
					
				});
			};
			


			$scope.hasProductListParent = function() {
				return $scope.dataStack.length > 1;
			}
					
			$scope.collapsePartsList = function() {
				$scope.statusMsg = "";
				$scope.dataStack.pop();
				var current = $scope.dataStack[$scope.dataStack.length - 1];
				console.log("current ", current);
				$scope.displayList = current.sort();
			}
			
			$scope.jumpToPartsList = function(index,partID){
				var current = Session.filterCrumbs(partID);
				$scope.dataStack.splice(index+1,$scope.dataStack.length);
				//$scope.dataStack.pop();
				$scope.displayList = current.children;
				console.log("partID ", partID);
				console.log("current.children", current.children);
				$scope.breadcrumbs = Session.getCrumbs();
			}
			
			$scope.expandPartsList = function(index) {
				$scope.statusMsg = "";
				console.log("expandPartsList " + index );
				var current = $scope.dataStack[$scope.dataStack.length - 1];
				console.log("current ", current);
				var childList = current[index].children;
				Session.sortPartNumbers(childList,'partslist_sort_order_F');
				$scope.displayList = childList;
				$scope.dataStack.push(childList);
				Session.addCrumbs(current[index]);
				$scope.breadcrumbs = Session.getCrumbs();
				console.log("$scope ", $scope);
				//console.log("$scope.dataStack ", $scope.dataStack);
				//console.log("Crumb: ", $scope.breadcrumbs.length);
			}

			$scope.addPart = function(index)
				{
					if (Session.getId() == 0) {
						$location.path("config/other");
						return;
					}

					header.setLoading(true);
					
					var id = $scope.displayList[index].id;
					var partNumber = $scope.displayList[index].partNumber;
				
					addPartService(Session.getId(), id).then(function(response)
						{
							console.log("response ", response);
							if (response.show == "WIZARD") {
								$scope.needsRefresh = true;
								header.setLastResultPage("edit");
								$location.path("config/customize");	
							} else {
								$scope.statusMsg = partNumber + " Added";
								$scope.displayList = $scope.partsList;
								$scope.dataStack.push($scope.partsList);
							}
							$scope.responseJson = JSON.stringify(response, null, 3);
							$scope.errorMsg = response.failureMessage;
							$scope.$broadcast('scroll.refreshComplete');
						},
						function(error)
						{
							$scope.errorMsg = "Could not post event";
							$scope.$broadcast('scroll.refreshComplete');
							header.setLoading(false);
							$ionicPopup.alert({
							       title: 'Error!',
							       template: error.failureMessage
							     });
							
							Session.close();
							$location.path("config/intro");
						});
					};
					
				$scope.$on('$ionicView.enter', function() {
					header.setLastResultPage("catalog");
					console.log("catalog refresh ",$scope.needsRefresh);
				     if ($scope.needsRefresh || footer.showFooter()) {
				    	 $scope.$parent.refreshViews(true);
				     }
				  })

				header.setLoading(true);
				$scope.getPartsList(Session.getId());
				console.log("catalogController",$scope);
				$scope.$parent.setCatalogView($scope);
	}		
	);

app.controller('editController',
		function($ionicPopup, $scope,$stateParams,$location,wizardViewEventService,messageViewEventService,processResponseService,header,footer,Session,partsListService,addPartService,wizardListService,wizardEventService,messagesService,quotesService,getItemFromArrayByKeyValue)
		{
	
			$scope.current=Session.getWizCrumbs()[Session.getWizCrumbs().length - 1];
			$scope.wizBreadcrumbs = Session.getWizCrumbs();

	
			$scope.jumpToWizardList = function(index,id){
				$scope.current = Session.filterWizCrumbs(id);
				console.log("id ", id);
				$scope.wizBreadcrumbs = Session.getWizCrumbs();
				$scope.setChildren();
			}
			
			$scope.setChildren = function() {
				var wizList = $scope.wizardList;
				for (var i = 1; i < $scope.wizBreadcrumbs.length; i++) {
					var crumb = $scope.wizBreadcrumbs[i];
					wizList = getItemFromArrayByKeyValue(wizList,"id",crumb.id).children;
				}
				$scope.currentChildren = wizList;
			}

			$scope.filterWizard = function(wizard) {
				return wizard.parentID == $scope.current.id;
			}
			
			$scope.selectedAction = "None";
			
			$scope.selectAction = function(action){
				$scope.selectedAction = action;
			}

			$scope.selectWizard = function(wizard) {
				console.log("selectWizard ", wizard);
				if ($scope.selectedAction != "None") {
					console.log("action ", $scope.selectedAction);				
					//header.setLoading(true);
					reqData = {"wizardID" : wizard.id,"actionID" : $scope.selectedAction.id,"actionName" : $scope.selectedAction.name};
					wizardViewEventService(Session.getId(),reqData).then(function (data)
					{
						processResponseService.process($scope, data);
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
		
					});
					$scope.selectedAction = "None"
				} else {
					if (wizard.children.length == 0) {
						return;
					}
					console.log("expand ");									
					$scope.current = {"id": wizard.id, "description" : wizard.description};
					console.log("current ", $scope.current);
					Session.addWizCrumbs($scope.current);
					$scope.wizBreadcrumbs = Session.getWizCrumbs();
					$scope.setChildren();
					console.log("$scope ", $scope);
//					console.log("$scope.wizBreadcrumbs ", $scope.wizBreadcrumbs);
//					console.log("Crumb: ", $scope.wizBreadcrumbs.length);
				}
			}

	
			$scope.getWizardList = function(sessionID)
			{
				if (sessionID == 0) {
					$location.path("config/intro");
					return;
				}

				wizardListService(sessionID).then(function(response)
					{
						$scope.wizardList = response.wizards;
						$scope.setChildren();
						$scope.wizardListJson = JSON.stringify(response, null, 3);
						$scope.errorMsg = response.failureMessage;
						$scope.$broadcast('scroll.refreshComplete');
						header.setLoading(false);
						$scope.needsRefresh = false;
					},
					function(error)
					{
						$scope.errorMsg = "Could not get wizard List";
						$scope.$broadcast('scroll.refreshComplete');
						header.setLoading(false);
						$ionicPopup.alert({
						       title: 'Error!',
						       template: error.failureMessage
						     });
						
						Session.close();
						$location.path("config/intro");
					});
			};

			$scope.$on('$ionicView.enter', function() {
				header.setLastResultPage("edit");
				console.log("edit refresh ",$scope.needsRefresh);
			     if ($scope.needsRefresh || footer.showFooter()) {
			    	 $scope.$parent.refreshViews(true);
			     }
			  })

			header.setLoading(true);
			$scope.getWizardList(Session.getId());
			console.log("editController",$scope);
			$scope.$parent.setEditView($scope);
		}		
	);

app.controller('messagesController',
		function($ionicPopup, $scope,$stateParams,$location,wizardViewEventService,messageViewEventService,processResponseService,header,footer,Session,partsListService,addPartService,wizardListService,wizardEventService,messagesService,quotesService,getItemFromArrayByKeyValue)
		{
	$scope.getMessages = function(sessionID)
	{
		if (sessionID == 0) {
			$location.path("config/other");
			return;
		}

		messagesService(sessionID).then(function(response)
			{
				$scope.messages = response.messages;
				var status = 5;
				for (var i = 0; i < $scope.messages.length; i++) {
					
					if ($scope.messages[i].severity == 'FAILURE' || $scope.messages[i].severity == 'INCOMPLETE') {
						$scope.messages[i]["severityNumber"] = 1;
					} else {
						if ($scope.messages[i].severity == 'WARNING') {
							$scope.messages[i]["severityNumber"] = 3;
						} else {
							if ($scope.messages[i].severity == 'INFORMATION') {
								$scope.messages[i]["severityNumber"] = 4;
							} else {
									$scope.messages[i]["severityNumber"] = 2;
							}
						}
					}
					
					console.log($scope.messages[i].severity, $scope.messages[i]);
					
					if ($scope.messages[i].severityNumber < status) {
						status = $scope.messages[i].severityNumber;
					} 
				}
				header.setStatus(status);

				$scope.messagesJson = JSON.stringify(response, null, 3);
				$scope.$broadcast('scroll.refreshComplete');
				header.setLoading(false);
				$scope.needsRefresh = false;
			},
			function(error)
			{
				$scope.errorMsg = "Could not get messages";
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

		$scope.selectMessageAction = function(message,action){
			console.log("action ", action);				
			header.setLoading(true);
			reqData = {"messageID" : message.id,"actionID" : action.id,"actionName" : action.name};
			messageViewEventService(Session.getId(),reqData).then(function (data)
			{
				processResponseService.process($scope, data);
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
		
			});
		}

				
					$scope.defaultAction = function(wizIndex)
					{
						if (Session.getId() == 0) {
							$location.path("config/other");
							return;
						}

						
						var wizardID = $scope.wizardList[wizIndex].id;
						var action = getItemFromArrayByKeyValue($scope.wizardList[wizIndex].actions, "sb_default_action_B", true)
						var actionID = action.id;
						var actionName = action.name;
						

						wizardEventService(Session.getId(), wizardID, actionID, actionName).then(function(response)
							{
								if (response.show == "WIZARD") {
									$scope.needsRefresh = true;
									$location.path("config/customize/" + wizardID);	
								}
								$scope.responseJson = JSON.stringify(response, null, 3);
								$scope.errorMsg = response.failureMessage;
								$scope.$broadcast('scroll.refreshComplete');
							},
							function(error)
							{
								$scope.errorMsg = "Could not post event";
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
						
						$scope.$on('$ionicView.enter', function() {
							header.setLastResultPage("messages");
							console.log("messages refresh ",$scope.needsRefresh);
						     if ($scope.needsRefresh || footer.showFooter()) {
						    	 $scope.$parent.refreshViews(true);
						     }
						  })

						header.setLoading(true);
						$scope.getMessages(Session.getId());
						console.log("messageController",$scope);
						$scope.$parent.setMessageView($scope);

		}		
	);

app.controller('summaryController',
		function($ionicPopup, $scope,$stateParams,$location,wizardViewEventService,messageViewEventService,processResponseService,header,footer,Session,partsListService,addPartService,wizardListService,wizardEventService,messagesService,quotesService,getItemFromArrayByKeyValue)
		{
						$scope.getQuote = function(sessionID)
						{
							if (sessionID == 0) {
								$location.path("config/other");
								return;
							}

							quotesService(sessionID).then(function(response)
								{
									$scope.quotes = response.quotes;
									$scope.quotesJson = JSON.stringify(response, null, 3);
									$scope.errorMsg = response.failureMessage;
									$scope.$broadcast('scroll.refreshComplete');
									header.setLoading(false);
									$scope.needsRefresh = false;
								},
								function(error)
								{
									$scope.errorMsg = "Could not get quotes";
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
							
							$scope.$on('$ionicView.enter', function() {
								header.setLastResultPage("summary");
								console.log("summary refresh ",$scope.needsRefresh);
								if ($scope.needsRefresh || footer.showFooter()) {
									$scope.$parent.refreshViews(true);
							     }
							  })

						
							header.setLoading(true);
							$scope.getQuote(Session.getId());
							console.log("summaryController",$scope);
							$scope.$parent.setSummaryView($scope);
		}		
	);

app.controller('diagramController',
		function($sce,$ionicPopup, $scope,$stateParams,$location,wizardViewEventService,messageViewEventService,processResponseService,header,footer,Session,BACKEND,diagramDataService,messagesService,utilFunctions)
		{
			$scope.getDiagram = function(sessionID)
			{
				if (sessionID == 0) {
					$location.path("config/other");
					return;
				}
				
					//var url = "https://"+BACKEND().ENDPOINT_URL+"/session/"+sessionID+"/diagram?format=SVG";//generateUrlString("session~"+sessionID+"~diagram?format=SVG");
					//$scope.daigram = url;
					//console.log("url ",url);
					diagramDataService(sessionID,true).then(function(response){
					var diagramData = response.substring(38);
					var dummyData ='<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" contentScriptType="text/ecmascript" height="2000" width="2000" zoomAndPan="magnify" contentStyleType="text/css" height="2000" preserveAspectRatio="xMidYMid meet" version="1.0"><g><rect x="10" y="10" fill-opacity="1.0" fill="#d6d3ce" width="90" height="230" stroke="black" stroke-width="1"/><text x="98" font-size="4" y="13" alignment-baseline="hanging" fill="black" style="writing-mode: tb; glyph-orientation-vertical: 90;" font-family="Times">7014-B42: Rack 1(ID 1)</text></g><g><rect x="10" y="20" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="23" alignment-baseline="hanging" font-family="Times">42|</text></g><g><rect x="15" y="20" fill-opacity="1.0" fill="#d4d0c8" width="70" height="10" stroke="black" stroke-width="1"/><text x="17" fill="black" font-size="6" y="23" alignment-baseline="hanging" font-family="Times">ER2T</text></g><g><rect x="10" y="25" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="28" alignment-baseline="hanging" font-family="Times">41|</text></g><g><rect x="10" y="30" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="33" alignment-baseline="hanging" font-family="Times">40|</text></g><g><rect x="10" y="35" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="38" alignment-baseline="hanging" font-family="Times">39|</text></g><g><rect x="10" y="40" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="43" alignment-baseline="hanging" font-family="Times">38|</text></g><g><rect x="10" y="45" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="48" alignment-baseline="hanging" font-family="Times">37|</text></g><g><rect x="10" y="50" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="53" alignment-baseline="hanging" font-family="Times">36|</text></g><g><rect x="10" y="55" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="58" alignment-baseline="hanging" font-family="Times">35|</text></g><g><rect x="10" y="60" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="63" alignment-baseline="hanging" font-family="Times">34|</text></g><g><rect x="10" y="65" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="68" alignment-baseline="hanging" font-family="Times">33|</text></g><g><rect x="10" y="70" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="73" alignment-baseline="hanging" font-family="Times">32|</text></g><g><rect x="10" y="75" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="78" alignment-baseline="hanging" font-family="Times">31|</text></g><g><rect x="10" y="80" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="83" alignment-baseline="hanging" font-family="Times">30|</text></g><g><rect x="10" y="85" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="88" alignment-baseline="hanging" font-family="Times">29|</text></g><g><rect x="10" y="90" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="93" alignment-baseline="hanging" font-family="Times">28|</text></g><g><rect x="10" y="95" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="98" alignment-baseline="hanging" font-family="Times">27|</text></g><g><rect x="10" y="100" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="103" alignment-baseline="hanging" font-family="Times">26|</text></g><g><rect x="10" y="105" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="108" alignment-baseline="hanging" font-family="Times">25|</text></g><g><rect x="10" y="110" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="113" alignment-baseline="hanging" font-family="Times">24|</text></g><g><rect x="10" y="115" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="118" alignment-baseline="hanging" font-family="Times">23|</text></g><g><rect x="10" y="120" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="123" alignment-baseline="hanging" font-family="Times">22|</text></g><g><rect x="15" y="120" fill-opacity="1.0" fill="#d4d0c8" width="70" height="5" stroke="black" stroke-width="1"/><text x="17" fill="black" font-size="2" y="123" alignment-baseline="hanging" font-family="Times">7316-TF4: Rack-Mounted Flat Panel Console Kit 1</text></g><g><rect x="10" y="125" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="128" alignment-baseline="hanging" font-family="Times">21|</text></g><g><rect x="15" y="125" fill-opacity="1.0" fill="#d4d0c8" width="70" height="5" stroke="black" stroke-width="1"/><text x="17" fill="black" font-size="2" y="128" alignment-baseline="hanging" font-family="Times">8831-NF2: Switch 4: Switch - 1</text></g><g><rect x="10" y="130" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="133" alignment-baseline="hanging" font-family="Times">20|</text></g><g><rect x="15" y="130" fill-opacity="1.0" fill="#d4d0c8" width="70" height="5" stroke="black" stroke-width="1"/><text x="17" fill="black" font-size="2" y="133" alignment-baseline="hanging" font-family="Times">8831-NF2: Switch 3: Switch - 1</text></g><g><rect x="10" y="135" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="138" alignment-baseline="hanging" font-family="Times">19|</text></g><g><rect x="15" y="135" fill-opacity="1.0" fill="#d4d0c8" width="70" height="5" stroke="black" stroke-width="1"/><text x="17" fill="black" font-size="2" y="138" alignment-baseline="hanging" font-family="Times">7120-48E: Switch 2: Switch - 1</text></g><g><rect x="10" y="140" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="143" alignment-baseline="hanging" font-family="Times">18|</text></g><g><rect x="15" y="140" fill-opacity="1.0" fill="#d4d0c8" width="70" height="5" stroke="black" stroke-width="1"/><text x="17" fill="black" font-size="2" y="143" alignment-baseline="hanging" font-family="Times">7120-48E: Switch 1: Switch - 1</text></g><g><rect x="10" y="145" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="148" alignment-baseline="hanging" font-family="Times">17|</text></g><g><rect x="10" y="150" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="153" alignment-baseline="hanging" font-family="Times">16|</text></g><g><rect x="10" y="155" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="158" alignment-baseline="hanging" font-family="Times">15|</text></g><g><rect x="10" y="160" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="163" alignment-baseline="hanging" font-family="Times">14|</text></g><g><rect x="10" y="165" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="168" alignment-baseline="hanging" font-family="Times">13|</text></g><g><rect x="10" y="170" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="173" alignment-baseline="hanging" font-family="Times">12|</text></g><g><rect x="10" y="175" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="178" alignment-baseline="hanging" font-family="Times">11|</text></g><g><rect x="10" y="180" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="183" alignment-baseline="hanging" font-family="Times">10|</text></g><g><rect x="10" y="185" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="188" alignment-baseline="hanging" font-family="Times">09|</text></g><g><rect x="10" y="190" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="193" alignment-baseline="hanging" font-family="Times">08|</text></g><g><rect x="10" y="195" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="198" alignment-baseline="hanging" font-family="Times">07|</text></g><g><rect x="15" y="195" fill-opacity="1.0" fill="#d4d0c8" width="70" height="5" stroke="black" stroke-width="1"/><text x="17" fill="black" font-size="2" y="198" alignment-baseline="hanging" font-family="Times">8374-01M: Secondary Mgmt Node: 2</text></g><g><rect x="10" y="200" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="203" alignment-baseline="hanging" font-family="Times">06|</text></g><g><rect x="15" y="200" fill-opacity="1.0" fill="#d4d0c8" width="70" height="5" stroke="black" stroke-width="1"/><text x="17" fill="black" font-size="2" y="203" alignment-baseline="hanging" font-family="Times">8374-01M: Primary Mgmt Node: 1</text></g><g><rect x="10" y="205" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="208" alignment-baseline="hanging" font-family="Times">05|</text></g><g><rect x="15" y="205" fill-opacity="1.0" fill="#d4d0c8" width="70" height="10" stroke="black" stroke-width="1"/><text x="17" fill="black" font-size="3" y="208" alignment-baseline="hanging" font-family="Times">8247-22L: Base Node 1 (Qty = 2(2))</text></g><g><rect x="10" y="210" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="213" alignment-baseline="hanging" font-family="Times">04|</text></g><g><rect x="10" y="215" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="218" alignment-baseline="hanging" font-family="Times">03|</text></g><g><rect x="15" y="215" fill-opacity="1.0" fill="#d4d0c8" width="70" height="10" stroke="black" stroke-width="1"/><text x="17" fill="black" font-size="3" y="218" alignment-baseline="hanging" font-family="Times">8247-22L: Base Node 1 (Qty = 2(1))</text></g><g><rect x="10" y="220" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="223" alignment-baseline="hanging" font-family="Times">02|</text></g><g><rect x="10" y="225" fill-opacity="1.0" fill="#ffffff" width="75" height="5" stroke="black" stroke-width="1"/><text x="12" fill="black" font-size="4" y="228" alignment-baseline="hanging" font-family="Times">01|</text></g><g><rect x="15" y="225" fill-opacity="1.0" fill="#d4d0c8" width="70" height="5" stroke="black" stroke-width="1"/><text x="17" fill="black" font-size="4" y="228" alignment-baseline="hanging" font-family="Times">ER1B</text></g><g><rect x="93" y="140" fill-opacity="1.0" fill="#ffffff" width="5" height="30" stroke="black" stroke-width="1"/><text x="96" font-size="2" y="143" alignment-baseline="hanging" fill="black" style="writing-mode: tb; glyph-orientation-vertical: 90;" font-family="Times">PDU Bay 4 : PDU4</text></g><g><rect x="93" y="140" fill-opacity="1.0" fill="#808080" width="5" height="30" stroke="black" stroke-width="1"/><text x="96" font-size="4" y="143" alignment-baseline="hanging" fill="black" style="writing-mode: tb; glyph-orientation-vertical: 90;" font-family="Times">7109</text></g><g><rect x="86" y="140" fill-opacity="1.0" fill="#ffffff" width="5" height="30" stroke="black" stroke-width="1"/><text x="89" font-size="2" y="143" alignment-baseline="hanging" fill="black" style="writing-mode: tb; glyph-orientation-vertical: 90;" font-family="Times">PDU Bay 3 : PDU3</text></g><g><rect x="86" y="140" fill-opacity="1.0" fill="#808080" width="5" height="30" stroke="black" stroke-width="1"/><text x="89" font-size="4" y="143" alignment-baseline="hanging" fill="black" style="writing-mode: tb; glyph-orientation-vertical: 90;" font-family="Times">7109</text></g><g><rect x="93" y="175" fill-opacity="1.0" fill="#ffffff" width="5" height="30" stroke="black" stroke-width="1"/><text x="96" font-size="2" y="178" alignment-baseline="hanging" fill="black" style="writing-mode: tb; glyph-orientation-vertical: 90;" font-family="Times">PDU Bay 2 : PDU2</text></g><g><rect x="93" y="175" fill-opacity="1.0" fill="#808080" width="5" height="30" stroke="black" stroke-width="1"/><text x="96" font-size="4" y="178" alignment-baseline="hanging" fill="black" style="writing-mode: tb; glyph-orientation-vertical: 90;" font-family="Times">7109</text></g><g><rect x="86" y="175" fill-opacity="1.0" fill="#ffffff" width="5" height="30" stroke="black" stroke-width="1"/><text x="89" font-size="2" y="178" alignment-baseline="hanging" fill="black" style="writing-mode: tb; glyph-orientation-vertical: 90;" font-family="Times">PDU Bay 1 : PDU1</text></g><g><rect x="86" y="175" fill-opacity="1.0" fill="#808080" width="5" height="30" stroke="black" stroke-width="1"/><text x="89" font-size="4" y="178" alignment-baseline="hanging" fill="black" style="writing-mode: tb; glyph-orientation-vertical: 90;" font-family="Times">7109</text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="300" y="220" fill-opacity="1.0" fill="#ffffff" width="80" height="20" stroke="black" stroke-width="1"/><text x="302" fill="black" font-size="2" y="223" alignment-baseline="hanging" font-family="Times"> 2076-524 Control Enclosure,  Qty. = 1</text></g><g><rect x="300" y="220" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="302" fill="black" font-size="2" y="223" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="300" y="220" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="302" fill="black" font-size="2" y="223" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="300" y="220" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="302" fill="black" font-size="2" y="223" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="300" y="220" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="302" fill="black" font-size="2" y="223" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="120" y="220" fill-opacity="1.0" fill="#ffffff" width="70" height="20" stroke="black" stroke-width="1"/><text x="122" fill="black" font-size="4" y="223" alignment-baseline="hanging" font-family="Times">2498-F48, Qty. = 1</text></g><g><rect x="120" y="220" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="122" fill="black" font-size="2" y="223" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="120" y="220" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="122" fill="black" font-size="2" y="223" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="120" y="220" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="122" fill="black" font-size="2" y="223" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="120" y="220" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="122" fill="black" font-size="2" y="223" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="120" y="220" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="122" fill="black" font-size="2" y="223" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="120" y="220" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="122" fill="black" font-size="2" y="223" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="120" y="220" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="122" fill="black" font-size="2" y="223" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="120" y="220" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="122" fill="black" font-size="2" y="223" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="120" y="220" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="122" fill="black" font-size="2" y="223" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="120" y="220" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="122" fill="black" font-size="2" y="223" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="120" y="220" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="122" fill="black" font-size="2" y="223" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="120" y="220" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="122" fill="black" font-size="2" y="223" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="210" y="220" fill-opacity="1.0" fill="#ffffff" width="70" height="20" stroke="black" stroke-width="1"/><text x="212" fill="black" font-size="4" y="223" alignment-baseline="hanging" font-family="Times">2498-F48, Qty. = 1</text></g><g><rect x="210" y="220" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="212" fill="black" font-size="2" y="223" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="210" y="220" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="212" fill="black" font-size="2" y="223" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="210" y="220" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="212" fill="black" font-size="2" y="223" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="210" y="220" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="212" fill="black" font-size="2" y="223" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="210" y="220" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="212" fill="black" font-size="2" y="223" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="210" y="220" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="212" fill="black" font-size="2" y="223" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="210" y="220" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="212" fill="black" font-size="2" y="223" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="210" y="220" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="212" fill="black" font-size="2" y="223" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="210" y="220" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="212" fill="black" font-size="2" y="223" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="210" y="220" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="212" fill="black" font-size="2" y="223" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="210" y="220" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="212" fill="black" font-size="2" y="223" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="210" y="220" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="212" fill="black" font-size="2" y="223" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g><g><rect x="0" y="0" fill-opacity="1.0" fill="#ffffff" width="0" height="0" stroke="black" stroke-width="1"/><text x="2" fill="black" font-size="2" y="3" alignment-baseline="hanging" font-family="Times"></text></g></svg>';
					//console.log("svgDiagram ",diagramData);
					
					$scope.svgData = $sce.trustAsHtml(diagramData);
					$scope.$broadcast('scroll.refreshComplete');
					angular.element(document).ready(function () {
				        //alert("content loaded");
				        var e = $('svg')[0];
						  e.id = "svg-id";
						  $("#svg-id").height(500);
						  $("#svg-id").width(1000);
						  panZoomInstance = svgPanZoom('#svg-id', {
						    zoomEnabled: true,
						    controlIconsEnabled: true,
						    fit: true,
						    center: true,
						    minZoom: 0.66
						  });
						  
						  // zoom out
						  panZoomInstance.zoom(0.2)

						  $("#move").on("click", function() {
						    // Pan by any values from -80 to 80
						    panZoomInstance.panBy({x: Math.round(Math.random() * 160 - 80), y: Math.round(Math.random() * 160 - 80)})
						  });
				    });
				},
				function(error)
				{
					$scope.errorMsg = "Could not get diagram objects";
					Session.addError(error);
					$scope.$broadcast('scroll.refreshComplete');
					header.setLoading(false);
					$ionicPopup.alert({
					       title: 'Error!',
					       template: error.failureMessage
						     });
					Session.close();
					$location.path("config/info");
				});
					header.setLoading(false);
					$scope.needsRefresh = false;
				};
			// get diagram objects...
				$scope.getDiagramObjects = function(sessionID)
				{
					diagramDataService(sessionID,false).then(function(response){
						var partList = utilFunctions.filterParts(response.diagram);
						var parts = [];
						console.log("partList == ",partList);
						console.log("diagram object == ",response.diagram);
						$scope.parts = partList;
						$scope.$broadcast('scroll.refreshComplete');
					},
					function(error)
					{
						$scope.errorMsg = "Could not get diagram objects";
						Session.addError(error);
						$scope.$broadcast('scroll.refreshComplete');
						header.setLoading(false);
						$ionicPopup.alert({
						       title: 'Error!',
						       template: error.failureMessage
							     });
						Session.close();
						$location.path("config/info");
					});
				}
				$scope.getDiagramObjects(Session.getId());
				
				$scope.treeOptions = {
					    nodeChildren: "children",
					    dirSelectable: true,
					    injectClasses: {
					        ul: "a1",
					        li: "a2",
					        liSelected: "a7",
					        iExpanded: "a3",
					        iCollapsed: "a4",
					        iLeaf: "a5",
					        label: "a6",
					        labelSelected: "a8"
					    }
				}
				$scope.selectedNodes = [];
				$scope.showSelected = function(node, selected) {
					$("#multi-selection-events-listing").append(","+node.label+ (selected?" selected":" deselected"));
				}
			// put other stuff here
			
			$scope.$on('$ionicView.enter', function() {
				header.setLastResultPage("diagram");
				console.log("diagram refresh ",$scope.needsRefresh);
				if ($scope.needsRefresh || footer.showFooter()) {
					$scope.$parent.refreshViews(true);
			    }
			 })

						
			header.setLoading(true);
			$scope.getDiagram(Session.getId());
			console.log("diagramController",$scope);
			$scope.$parent.setDiagramView($scope);
		}		
	);











//OLD
//app.controller('resultsController',
//	function($ionicPopup, $scope,$stateParams,$location,wizardViewEventService,messageViewEventService,processResponseService,header,footer,Session,partsListService,addPartService,wizardListService,wizardEventService,messagesService,quotesService,getItemFromArrayByKeyValue)
//	{
//		$scope.header = header;
//		header.setHasBack(false);
//		$scope.footer = footer;
//		footer.setVisability(false);
//		console.log("resultsController",$scope);
//		$scope.getPartsList = function(sessionID)
//		{
//			$scope.statusMsg = "";
//			if (sessionID == 0) {
//				$location.path("config/other");
//				return;
//			}
//
//
//			
//			partsListService(sessionID).then(function(response)
//			{
//				Session.clearAllCrumbs();
//				var responsePartList = response.partsList
//				Session.sortPartNumbers(responsePartList,'partslist_sort_order_F');
//				$scope.partsList = responsePartList;
//				$scope.displayList = $scope.partsList;
//				$scope.dataStack.push($scope.partsList);
//				$scope.partsListJson = JSON.stringify(response, null, 3);
//				$scope.errorMsg = response.failureMessage;
//				
//				Session.addCrumbs($scope.partsList);
//				$scope.breadcrumbs = Session.getCrumbs();				
//				$scope.$broadcast('scroll.refreshComplete');
//				$scope.getWizardList(Session.getId());
//			},
//			function(error)
//			{
//				$scope.errorMsg = "Could not get parts List";
//				$scope.$broadcast('scroll.refreshComplete');
//				header.setLoading(false);
//				$ionicPopup.alert({
//				       title: 'Error!',
//				       template: error.failureMessage
//				     });
//				
//				Session.close();
//				$location.path("config/info");
//			});
//		};
//		
//		header.setLoading(true);
//		$scope.getPartsList(Session.getId());
//
//		$scope.hasProductListParent = function() {
//			return $scope.dataStack.length > 1;
//		}
//				
//		$scope.dataStack = [];
//		$scope.collapsePartsList = function() {
//			$scope.statusMsg = "";
//			$scope.dataStack.pop();
//			var current = $scope.dataStack[$scope.dataStack.length - 1];
//			console.log("current ", current);
//			$scope.displayList = current.sort();
//		}
//		
//		$scope.jumpToPartsList = function(index,partID){
//			var current = Session.filterCrumbs(partID);
//			$scope.dataStack.splice(index+1,$scope.dataStack.length);
//			//$scope.dataStack.pop();
//			$scope.displayList = current.children;
//			console.log("partID ", partID);
//			console.log("current.children", current.children);
//			$scope.breadcrumbs = Session.getCrumbs();
//		}
//		
//		$scope.expandPartsList = function(index) {
//			$scope.statusMsg = "";
//			console.log("expandPartsList " + index );
//			var current = $scope.dataStack[$scope.dataStack.length - 1];
//			console.log("current ", current);
//			var childList = current[index].children;
//			Session.sortPartNumbers(childList,'partslist_sort_order_F');
//			$scope.displayList = childList;
//			$scope.dataStack.push(childList);
//			Session.addCrumbs(current[index]);
//			$scope.breadcrumbs = Session.getCrumbs();
//			console.log("$scope ", $scope);
//			console.log("$scope.dataStack ", $scope.dataStack);
//			console.log("Crumb: ", $scope.breadcrumbs.length);
//		}
//
//			$scope.addPart = function(index)
//			{
//				if (Session.getId() == 0) {
//					$location.path("config/other");
//					return;
//				}
//
//				header.setLoading(true);
//				
//				var id = $scope.displayList[index].id;
//				var partNumber = $scope.displayList[index].partNumber;
//			
//				addPartService(Session.getId(), id).then(function(response)
//					{
//						console.log("response ", response);
//						if (response.show == "WIZARD") {
//							$location.path("config/customize");	
//						} else {
//							$scope.statusMsg = partNumber + " Added";
//							$scope.displayList = $scope.partsList;
//							$scope.dataStack.push($scope.partsList);
//						}
//						$scope.responseJson = JSON.stringify(response, null, 3);
//						$scope.errorMsg = response.failureMessage;
//						$scope.$broadcast('scroll.refreshComplete');
//					},
//					function(error)
//					{
//						$scope.errorMsg = "Could not post event";
//						$scope.$broadcast('scroll.refreshComplete');
//						header.setLoading(false);
//						$ionicPopup.alert({
//						       title: 'Error!',
//						       template: error.failureMessage
//						     });
//						
//						Session.close();
//						$location.path("config/intro");
//					});
//				};
//			
//		
//
//		$scope.getWizardList = function(sessionID)
//		{
//			if (sessionID == 0) {
//				$location.path("config/intro");
//				return;
//			}
//
//			wizardListService(sessionID).then(function(response)
//				{
//					$scope.wizardList = response.wizards;
//					$scope.setChildren();
//					$scope.wizardListJson = JSON.stringify(response, null, 3);
//					$scope.errorMsg = response.failureMessage;
//					$scope.$broadcast('scroll.refreshComplete');
//					$scope.getMessages(Session.getId());
//				},
//				function(error)
//				{
//					$scope.errorMsg = "Could not get wizard List";
//					$scope.$broadcast('scroll.refreshComplete');
//					header.setLoading(false);
//					$ionicPopup.alert({
//					       title: 'Error!',
//					       template: error.failureMessage
//					     });
//					
//					Session.close();
//					$location.path("config/intro");
//				});
//			};
//			
//			$scope.selectMessageAction = function(message,action){
//				console.log("action ", action);				
//				header.setLoading(true);
//				reqData = {"messageID" : message.id,"actionID" : action.id,"actionName" : action.name};
//				messageViewEventService(Session.getId(),reqData).then(function (data)
//				{
//					processResponseService.process($scope, data);
//				},
//				function(error)
//				{
//					$scope.errorMsg = "Could not updateControl panel";
//					$scope.$broadcast('scroll.refreshComplete');
//					header.setLoading(false);
//					$ionicPopup.alert({
//						title: error.failureMessage,
//						template: $scope.errorMsg
//					});
//			
//				});
//			}
//
//			$scope.selectedAction = "None";
//			
//			$scope.selectAction = function(action){
//				$scope.selectedAction = action;
////				var current = Session.filterCrumbs(partID);
////				$scope.dataStack.splice(index+1,$scope.dataStack.length);
////				//$scope.dataStack.pop();
////				$scope.displayList = current.children;
////				console.log("partID ", partID);
////				console.log("current.children", current.children);
////				$scope.breadcrumbs = Session.getCrumbs();
//			}
//			
//			$scope.current=Session.getWizCrumbs()[Session.getWizCrumbs().length - 1];
//			$scope.wizBreadcrumbs = Session.getWizCrumbs();
//
//			
//			$scope.jumpToWizardList = function(index,id){
//				$scope.current = Session.filterWizCrumbs(id);
//				console.log("id ", id);
//				$scope.wizBreadcrumbs = Session.getWizCrumbs();
//				$scope.setChildren();
//			}
//
//			$scope.setChildren = function() {
//				var wizList = $scope.wizardList;
//				for (var i = 1; i < $scope.wizBreadcrumbs.length; i++) {
//		    		  var crumb = $scope.wizBreadcrumbs[i];
//		    		  wizList = getItemFromArrayByKeyValue(wizList,"id",crumb.id).children;
//		    	}
//				$scope.currentChildren = wizList;
//			}
//
//			$scope.filterWizard = function(wizard) {
//				return wizard.parentID == $scope.current.id;
//			}
//			
//			$scope.selectWizard = function(wizard) {
//				console.log("selectWizard ", wizard);
//				if ($scope.selectedAction != "None") {
//					console.log("action ", $scope.selectedAction);				
//					//header.setLoading(true);
//					reqData = {"wizardID" : wizard.id,"actionID" : $scope.selectedAction.id,"actionName" : $scope.selectedAction.name};
//					wizardViewEventService(Session.getId(),reqData).then(function (data)
//					{
//						processResponseService.process($scope, data);
//					},
//					function(error)
//					{
//						$scope.errorMsg = "Could not updateControl panel";
//						$scope.$broadcast('scroll.refreshComplete');
//						header.setLoading(false);
//						$ionicPopup.alert({
//							title: error.failureMessage,
//							template: $scope.errorMsg
//					     });
//					
//					});
//				} else {
//					if (wizard.children.length == 0) {
//						return;
//					}
//					console.log("expand ");									
//					$scope.current = {"id": wizard.id, "description" : wizard.description};
//					console.log("current ", $scope.current);
//					Session.addWizCrumbs($scope.current);
//					$scope.wizBreadcrumbs = Session.getWizCrumbs();
//					$scope.setChildren();
//					console.log("$scope ", $scope);
//					console.log("$scope.wizBreadcrumbs ", $scope.wizBreadcrumbs);
//					console.log("Crumb: ", $scope.wizBreadcrumbs.length);
//				}
//			}
//			
//			//var validActions = ["interactive_edit", "interactive_delete_wizard", "interactive_duplicate_wizard","sq_interactive_mass_feature_event"]
//			$scope.validAction = function(action) {
//				return action.group_F != 90 && action.sb_enabled_event_B;
//				//return validActions.indexOf(action.name) > -1 && action.sb_enabled_event_B;
//			}
//		
//			$scope.filteredAction = function(action) {
//				return action.group_F != 90 && action.sb_enabled_event_B;
//				//return validActions.indexOf(action.name) > -1 && action.sb_enabled_event_B;
//			}
//			
//			$scope.getMessages = function(sessionID)
//			{
//				if (sessionID == 0) {
//					$location.path("config/other");
//					return;
//				}
//
//				messagesService(sessionID).then(function(response)
//					{
//						$scope.messages = response.messages;
//						var status = 5;
//						for (var i = 0; i < $scope.messages.length; i++) {
//							
//							if ($scope.messages[i].severity < status) {
//								status = $scope.messages[i].severity;
//							} 
//						}
//						header.setStatus(status);
//
//						$scope.messagesJson = JSON.stringify(response, null, 3);
//						$scope.$broadcast('scroll.refreshComplete');
//						$scope.getQuote(Session.getId());
//					},
//					function(error)
//					{
//						$scope.errorMsg = "Could not get messages";
//						$scope.$broadcast('scroll.refreshComplete');
//						header.setLoading(false);
//						$ionicPopup.alert({
//						       title: 'Error!',
//						       template: error.failureMessage
//						     });
//						
//						Session.close();
//						$location.path("config/info");
//					});
//				};
//				
//			
//				$scope.defaultAction = function(wizIndex)
//				{
//					if (Session.getId() == 0) {
//						$location.path("config/other");
//						return;
//					}
//
//					header.setLoading(true);
//					
//					var wizardID = $scope.wizardList[wizIndex].id;
//					var action = getItemFromArrayByKeyValue($scope.wizardList[wizIndex].actions, "sb_default_action_B", true)
//					var actionID = action.id;
//					var actionName = action.name;
//					
//					wizardEventService(Session.getId(), wizardID, actionID, actionName).then(function(response)
//						{
//							if (response.show == "WIZARD") {
//								$location.path("config/customize/" + wizardID);	
//							}
//							$scope.responseJson = JSON.stringify(response, null, 3);
//							$scope.errorMsg = response.failureMessage;
//							$scope.$broadcast('scroll.refreshComplete');
//						},
//						function(error)
//						{
//							$scope.errorMsg = "Could not post event";
//							$scope.$broadcast('scroll.refreshComplete');
//							header.setLoading(false);
//							$ionicPopup.alert({
//							       title: 'Error!',
//							       template: error.failureMessage
//							     });
//							
//							Session.close();
//							$location.path("config/info");
//						});
//					};
//		
//					
//					$scope.getQuote = function(sessionID)
//					{
//						if (sessionID == 0) {
//							$location.path("config/other");
//							return;
//						}
//
//						quotesService(sessionID).then(function(response)
//							{
//								$scope.quotes = response.quotes;
//								$scope.quotesJson = JSON.stringify(response, null, 3);
//								$scope.errorMsg = response.failureMessage;
//								$scope.$broadcast('scroll.refreshComplete');
//								header.setLoading(false);
//
//							},
//							function(error)
//							{
//								$scope.errorMsg = "Could not get quotes";
//								$scope.$broadcast('scroll.refreshComplete');
//								header.setLoading(false);
//
//								$ionicPopup.alert({
//								       title: 'Error!',
//								       template: error.failureMessage
//								     });
//								
//								Session.close();
//								$location.path("config/info");
//							});
//						};
//					
//	}		
//);
