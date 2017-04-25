app.controller('errorController',
		function($scope,$routeParams,Session,$location,busyIndicator)
		{
				$scope.errors = Session.getErrors();
				busyIndicator.show();
		}		
);