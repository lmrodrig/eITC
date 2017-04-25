app.factory("getItemFromArrayById", function() {
	return function(dataArray, id) {
		console.log("In getItemFromArrayById Service");
		for (var d = 0, len = dataArray.length; d < len; d += 1) {
			//console.log("check " + dataArray[d].id);
			if (dataArray[d].id == id) {
				console.log("matched " + dataArray[d]);
				return dataArray[d];
			}
		}
		console.log("no item matched for " + id);
		return {};
	};
});

app.factory("getItemFromArrayByKeyValue", function() {
	return function(dataArray, key, value) {
		console.log("In getItemFromArrayByKeyValue Service");
		for (var d = 0, len = dataArray.length; d < len; d += 1) {
			//console.log("check " + dataArray[d][key]);
			if (dataArray[d][key] == value) {
				console.log("matched " + dataArray[d]);
				return dataArray[d];
			}
		}
		console.log("no item matched for " + value);
		return {};
	};
});

app.factory("getItemFromArrayByKeyValue2", function() {
	return function(dataArray, key, value) {
		//console.log("In getItemFromArrayByKeyValue Service");
		for (var d = 0, len = dataArray.length; d < len; d += 1) {
			//console.log("check " + dataArray[d][key]);
			if (dataArray[d][key] == value) {
				console.log("matched " + dataArray[d]);
				return { "result" : dataArray[d]};
			}
		}
		console.log("no item matched for " + value);
		return { "result" : "None"};
	};
});
app.factory("generateUrlString", function(BACKEND) {
	return function(endPoint) {
		var adapter = "/" + BACKEND().ADAPTER_URL;
		
		if (BACKEND().ADAPTER_PORT.length > 0) {
			adapter = adapter + ":"	+ BACKEND().ADAPTER_PORT; 
		} 
		var target = "/" + BACKEND().ENDPOINT_URL + "/"	+ BACKEND().ENDPOINT_PORT;
		var urlString = "http://" + adapter + "/api" + target + "/" + endPoint;
		return urlString;
	};
});
app.factory("utilFunctions", function(){
	var util = {};
	util.filterParts = function(diagramObjects){
    	var partList = [];
    	for(var x=0;x<diagramObjects.length;x++){
    		var part = diagramObjects[x];
    		if(part.label=="" && part.width==0 && part.height==0){
    			
    		}
    		else{
    			partList.push(part);
    			part.children = this.filterChilds(part);
    		}
    	}
    	return partList;
    }
	util.filterChilds = function(partInstance){
    	var children = partInstance.children;
    	if(children=='undefined'||children.length==0){
    		return children;
    	}
    	else{
    		return (this.filterParts(children));
    	}
    }
	return util;
});

