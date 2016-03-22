var description = document.getElementById("eow-description");

var discogsFetch = (function(){
	
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


    function collectDiscogsInfo(discogsLink) {
    	console.log('Start collectDiscogsInfo');
    	urlPieces = discogsLink.split("/");

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

    	discogsResourceUrl = 'https://api.discogs.com/' + discogsData.type + '/' + discogsData.id;
    	
     	return axios.get(discogsResourceUrl).then(function(response){
     		discogsDataCompile['title'] = response.data.title;
	        discogsDataCompile['year'] = response.data.year;
	        discogsDataCompile['labels'] = response.data.labels;
	        discogsDataCompile['artists'] = response.data.artists;
	        discogsDataCompile['tracklist'] = response.data.tracklist;
	        console.log('Finished collectDiscogsInfo');
     	});
		 
    }

    function collectMarketplaceInfo() {
    	console.log('Start collectMarketplaceInfo');

    	if(discogsData.type == 'masters'){
    		marketplaceResourceUrl = 'https://api.discogs.com/marketplace/search?master_id=' + discogsData.id
    	}
    	if(discogsData.type == 'releases'){
    		marketplaceResourceUrl = 'https://api.discogs.com/marketplace/search?release_id='  + discogsData.id
    	}

    	return axios.get(marketplaceResourceUrl).then(function(response){
     		discogsDataCompile['marketplace'] = response.data;
	        console.log('Finished collectMarketplaceInfo');
     	});
    }

    function createDiscogsElement(contentElement){
    	console.log('createDiscogsElement');

    	tracksListed = "yeaaah";

    	discogsElement = '<div id="COLLECT"><div id="information-DISCOGS"><p><strong>' 
    	+ discogsDataCompile.artists[0].anv 
    	+ ' - ' 
    	+ discogsDataCompile.title 
    	+ '</strong>'
    	+ '<p>Label: '
    	+ discogsDataCompile.labels[0].name
    	+ ' - ' 
    	+ discogsDataCompile.labels[0].catno
    	+ '</p>'
    	+ '<p>'
    	+ '<strong>Tracklisting</strong>'
    	+ tracksListed
    	+ '</p>'
    	+ '</p></div><div id="marketplace-DISCOGS"></div></div>';

    	contentElement.insertAdjacentHTML('afterend', discogsElement);

    	return contentElement;
    }

    function createMarketplaceModule(contentElement){
    	console.log('createMarketplaceModule');
    	var info = document.getElementById("marketplace-DISCOGS");
    	// select 
    	marketplaceElement = '<p>created</p>';
    	info.innerHTML = marketplaceElement;
    	return contentElement;
    }

    function initialize( contentElement ) {
    	discogsData = new Object(),
	    discogsMarketplace = new Array(),
	    discogsDataCompile = new Object();

  		discogsLinks = collectLinks(contentElement);
  		if(discogsLinks){
  			collectDiscogsInfo(discogsLinks[0])
  			.then(function(){
  				createDiscogsElement(contentElement);
  				collectMarketplaceInfo()
  				.then(function(){
  					createMarketplaceModule(contentElement);
  					console.log("FINAL FINISH");
  				});
  			})
  		}
    }

    return {
        init: initialize
    };
})();

discogsFetch.init(description);