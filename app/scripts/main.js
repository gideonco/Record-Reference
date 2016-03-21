var description = document.getElementById("eow-description");
var deferred = Q.defer();
// Fill the block out with this information with a function. 

// Discogs Reference for Youtube
// - Youtube

var discogsFetch = (function(){
    var discogsDataCompile = [];

    function populateData(ele, data) {
        console.log('ue');
    }

    function collectDiscogsInfo(discogsLink) {
    	urlPieces = discogsLink.split("/"),
    	discogsData = {};


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
	            deferred.resolve(request.responseText);
	            discogsDataCompile.push(discogsResourceUrl);
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
    	collectedData = [];

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

    function createDiscogsElement(){

    }

  	function initialize( contentElement ) {
  		createDiscogsElement();
  		discogsLinks = collectLinks(contentElement);
  		if(discogsLinks){
	        collectDiscogsInfo(discogsLinks[0]).then(function(){
	        	  // create a new div element 
				  // and give it some content 
				  var newDiv = document.createElement("div"); 
				  var newContent = document.createTextNode("Hi there and greetings!"); 
				  newDiv.appendChild(newContent); //add the text node to the newly created div. 

				  // add the newly created element and its content into the DOM 
				  document.body.insertAfter(newDiv, contentElement); 
	        });
  		}
    }

    return {
        data: discogsDataCompile,
        init: initialize
    }; 
})();


discogsFetch.init(description);