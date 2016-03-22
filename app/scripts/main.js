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
    	discogsMarketplace = new Array();


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
    	
    	axios.get(discogsResourceUrl)
		  .then(function (response) {
		    console.log('successful discogs api call');
		    discogsDataCompile['title'] = response.title;
            discogsDataCompile['year'] = response.year;
            discogsDataCompile['labels'] = response.labels;
            discogsDataCompile['artists'] = response.artists;
            discogsDataCompile['tracklist'] = response.tracklist;
            resolve(discogsDataCompile);
		  })
		  .catch(function (response) {
		    console.log(response);
		  });
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

    	console.log('collectMarketplaceInfo')

    }

    function createDiscogsElement(contentElement){
    	console.log('createDiscogsElement');
    	contentElement.insertAdjacentHTML('afterend', '<div id="COLLECT"><div id="information-DISCOGS"></div><div id="marketplace-DISCOGS"></div></div>');
    	return contentElement;
    }

    function createMarketplaceModule(contentElement){
    	console.log('createMarketplaceModule');
    	var info = document.getElementById("information-DISCOGS");
    	// select 

    	return contentElement;
    }


  	function initialize( contentElement ) {
  		discogsLinks = collectLinks(contentElement);
  		if(discogsLinks){
  			
  			collectDiscogsInfo(discogsLinks[0]).then(function(res){
	        	console.log('after');
	        });
	        
	        // 	createDiscogsElement(contentElement);
	        // .then(collectMarketplaceInfo())
	        // .then(function(){
	        // 	createMarketplaceModule(contentElement)
	        // })
	        // .catch(function(){
	        // 	console.log('fails');
	        // });
  		}
    }

    return {
        init: initialize
    };
})();


discogsFetch.init(description);
