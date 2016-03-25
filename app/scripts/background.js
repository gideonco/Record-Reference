chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	if(changeInfo.status == 'complete' && tab.status == 'complete'){	
	    chrome.tabs.sendMessage(tabId, {pageChange: true}, function(response) {
	    	console.log(response);
		});
	}
});