
app.controller('productBasesController',
		
		function($scope,$location,productBasesService,Session,closeSessionService,busyIndicator,header,footer)
		{
			var productBases = [
            { id: "Power",
              name: 'POWER Systems(Rack, tower and blades)',
              geo: 'US',
              language: 'EN',
             }];


			$scope.header = header;
			header.setHasBack(false);
			$scope.footer = footer;
			footer.setVisability(false);
			var sessionId = Session.getId();
			if (sessionId > 0) {
				$location.path("startOver");
				return;
			}



			$scope.getProductBases = function()
			{
				$scope.productBases = productBases;
				$scope.errorMsg = "";
				busyIndicator.show();
				console.log("Calling ProductBases Service",$scope);
				header.setLoading(true);
				/*
				productBasesService().then(function (productBases)
				
				{*/
					console.log("Got ProductBases",productBases);
					$scope.productBases = productBases;
					//$scope.json = JSON.stringify(productBases, null, 3);
					$scope.$broadcast('scroll.refreshComplete');
					header.setLoading(false);
					$scope.errorMsg = "";
			/*	},
				function(error)
				{
					$scope.errorMsg = "Could not get ProductBases";
					$scope.$broadcast('scroll.refreshComplete');
					header.setLoading(false);
				});*/
				
			};
			$scope.getProductBases();
			console.log("productBasesController",$scope);
			
		}		
);

app.controller('introController',
		
		function($scope,$location,productBasesService,Session,closeSessionService,busyIndicator,header,footer)
		{
			$scope.header = header;
			header.setHasBack(false);
			$scope.footer = footer;
			footer.setVisability(false);

		}		
);