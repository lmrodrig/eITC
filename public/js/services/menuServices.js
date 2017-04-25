app.factory("header", function($ionicPopup) {
	console.log("In header Service");
	var title = 'e-config POC';
	var showJSON = false;
	
	var back = "";
	var backB = false;
	var backWere = "";
	var isLoading = false;
	var loadingOverlay;
	var status = 6;
	var lastResultPage = "edit";


	return {
		title: function() { return title; },
		setTitle: function(newTitle) { title = newTitle },
		status: function() { return status; },
		setStatus: function(newStatus) { status = newStatus },
		showJSON: function() { return showJSON; },
		setShowJSON: function(value) { showJSON = value },
		back: function() { return back; },
		setBack: function(value) { back = value; backB = true; },
		getBack: function() { return back; },
		hasBack: function() { return backB; },
		setHasBack: function(value) { backB = value;},
		setLastResultPage: function(resultPage) { lastResultPage = resultPage },
		getLastResultPage: function() { return lastResultPage; },
		isLoading: function() { return isLoading; },
		setLoading: function(value) { 
//			if (!isLoading && value) {
//				
//				loadingOverlay = $ionicPopup.show({
//					title: 'Loading...',
//				});
//			} else if (!value) {
//				loadingOverlay.close();
//			}
			isLoading = value;
		},
	};
});

app.factory("footer", function() {
	console.log("In footer Service");
	var scope;
	var show = true;
	return {
		setScope: function(value) { console.log("set footer scope", value);scope = value; },
		setVisability: function(value) { show = value; },
		showFooter: function() { return show; },
		getScope: function() { return scope; }
	};
});
