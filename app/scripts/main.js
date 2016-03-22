var description = document.getElementById("eow-description");
var deferred = Q.defer();
// Fill the block out with this information with a function. 

// Discogs Reference for Youtube
// - Youtube

var discogsFetch = (function(){
    var discogsDataCompile = new Object();

    function collectDiscogsInfo(discogsLink) {
    	urlPieces = discogsLink.split("/"),
    	discogsData = new Object(),
    	discogsMarketplace = new Object();


    	for (var prop in urlPieces) {
		  // ID
		  if(urlPieces[prop].match(/^[0-9]+$/) != null){
		  	discogsData.id = urlPieces[prop];
		  }
		  // TYPE
		  if(urlPieces[prop].match('release')){
		  	discogsData.type = 'releases';
		  }
		  if(urlPieces[prop].match('master')){
		  	discogsData.type = 'masters';
		  }
		}



    	// dummy 
    	discogsResourceUrl = 'https://api.discogs.com/' + discogsData.type + '/' + discogsData.id;

    	var request = new XMLHttpRequest();

	    request.open("GET", discogsResourceUrl, true);
	    request.onload = onload;
	    request.onerror = onerror;
	    request.onprogress = onprogress;
	    request.send();

	    function onload() {
	        if (request.status === 200) {
	            console.log('successful discogs api call');

	            res = JSON.parse(request.response);

	            discogsDataCompile['title'] = res.title;
	            discogsDataCompile['year'] = res.year;
	            discogsDataCompile['labels'] = res.labels;
	            discogsDataCompile['artists'] = res.artists;
	            discogsDataCompile['tracklist'] = res.tracklist;
	            deferred.resolve();
	        } else {
	            deferred.reject(new Error("Status code was " + request.status));
	        }
	    }

	    function onerror() {
	        deferred.reject(new Error("Can't XHR " + JSON.stringify(discogsResourceUrl)));
	    }

	    function onprogress(event) {
	        deferred.notify(event.loaded / event.total);
	    }
	    return deferred.promise;
    }

    function collectLinks(contentElement){
    	// what about broken links, find with regex.
    	links = contentElement.getElementsByTagName('a'),
    	collectedData = new Array();

    	function checkForDiscogsLink(element){
    		if(element.href.includes('discogs.com')){
	        	collectedData.push(element.href);
	    	}
    	}
    	
    	if(links.length <= 0){
    		console.log('no links, clean me up');
    	}else{
    		// make a link out of the obj
    		linksArray = Array.prototype.slice.call(links);
    		linksArray.forEach(checkForDiscogsLink);
    		return collectedData;
    	}
    }

    function collectMarketplaceInfo(){
    	var request = new XMLHttpRequest();
    	if(discogsData.type == 'masters'){
    		marketplaceResourceUrl = 'https://api.discogs.com/marketplace/search?master_id=' + discogsData.id
    	}
    	if(discogsData.type == 'releases'){
    		marketplaceResourceUrl = 'https://api.discogs.com/marketplace/search?release_id='  + discogsData.id
    	}

    	request.open("GET", marketplaceResourceUrl, true);
	    request.onload = onload;
	    request.onerror = onerror;
	    request.onprogress = onprogress;
	    request.send();
	    function onload() {
	    	if (request.status === 200) {
	    		console.log('successful marketplace api call');
	            discogsMarketplace  = JSON.parse(request.response);
	            console.log(discogsMarketplace);
	            deferred.resolve(discogsMarketplace);
	        } else {
	            deferred.reject(new Error("Status code was " + request.status));
	        }
	    }

	    function onerror() {
	        deferred.reject(new Error("Can't XHR " + JSON.stringify(discogsResourceUrl)));
	    }

	    function onprogress(event) {
	        deferred.notify(event.loaded / event.total);
	    }
	    return deferred.promise;
    }

    function createDiscogsElement(contentElement){
    	console.log('createDiscogsElement');
    	contentElement.insertAdjacentHTML('afterend', '<div id="COLLECT"><div id="information-DISCOGS"></div><div id="marketplace-DISCOGS"></div></div>');
    }

    function createMarketplaceModule(contentElement){
    	console.log('createMarketplaceModule');
    	var info = document.getElementById("information-DISCOGS");
    	console.log(discogsMarketplace);
    	// select 
    	
    	
    	
    }


  	function initialize( contentElement ) {
  		discogsLinks = collectLinks(contentElement);
  		if(discogsLinks){
	        collectDiscogsInfo(discogsLinks[0])
	        .then(function(){
	        	createDiscogsElement(contentElement);
	        })
	        .then(collectMarketplaceInfo)
	        .then(function(){
        		createMarketplaceModule(contentElement);
	        });
  		}
    }

    return {
        init: initialize
    };
})();


discogsFetch.init(description);
