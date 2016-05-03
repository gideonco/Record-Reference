chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	if(tab.status == 'complete' && tab.status){	
	    chrome.tabs.sendMessage(tabId, {tab: tab, changeInfo, pageChange: true}, function(response) {
	    	console.log('complete');
		});
	}else{
		chrome.tabs.sendMessage(tabId, {tab: tab, changeInfo, pageChange: false}, function(response) {
	    	console.log('failed');
		});
	}

});