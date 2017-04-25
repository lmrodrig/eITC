app.factory("productBasesService", function($http, $q, generateUrlString) {
	/*
	return function() {
		console.log("In productBasesService Method");
		
		var deferred = $q.defer();

		$http.get(generateUrlString("productBase")).success(function(data, status) {
			//productBases = data;
			deferred.resolve(data);
		}).error(function(data) {
			deferred.reject("Failed to get ProductBases");
		});

		return deferred.promise;
	};*/
	return function(){

		console.log("In productProvider Method");
    
   		 var products = [
            { prod_id: "Power",
              name: 'POWER Systems(Rack, tower and blades)',
              geo: 'US',
              language: 'EN',
              cooking_time: 15,
              ingredients: [ "400g spaghetti", "4tbsp pesto sauce",
                             "salt to taste" ]
            }
          ];

          this.getAllProducts = function () {
              return products;
          };
      };
});

