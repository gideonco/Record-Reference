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
            return false;
        }else{
            // make a link out of the obj
            linksArray = Array.prototype.slice.call(links);
            linksArray.forEach(checkForDiscogsLink);
            return collectedData;
        }
    }


    function collectDiscogsInfo(discogsLink) {
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
        });
         
    }

    function collectMarketplaceInfo() {

        if(discogsData.type == 'masters'){
            marketplaceResourceUrl = 'https://api.discogs.com/marketplace/search?master_id=' + discogsData.id
        }
        if(discogsData.type == 'releases'){
            marketplaceResourceUrl = 'https://api.discogs.com/marketplace/search?release_id='  + discogsData.id
        }

        return axios.get(marketplaceResourceUrl).then(function(response){
            discogsDataCompile['marketplace'] = response.data;
        });
    }

    function createDiscogsElement(injectionPoint){
        var trackListing = "";
            
        discogsElement = '<div class="yt-card yt-card-has-padding"><div id="collectContainer-DISCOGS" class="column"><div id="information-DISCOGS"><p><h2>';
        
        discogsDataCompile.artists.forEach( function (track, i){
            discogsElement += '<a target="_blank" href="https://www.discogs.com/artist/'
            + discogsDataCompile.artists[i].id
            + '">';
            
            if(discogsDataCompile.artists[i].name.length > 1 ){
               discogsElement += discogsDataCompile.artists[i].name;
            }else{
                discogsElement += discogsDataCompile.artists[i].anv;
            }
            discogsElement += '</a>'
            if(discogsDataCompile.artists[i+1]){
                discogsElement += ', ';
            }
        });

            
        
        discogsElement += ' - '
        + '<a target="_blank" href="' + discogsLinks[0] + '">'
        + discogsDataCompile.title 
        + '</a>'
        + '</h2>'
        + '<span class="label-DISCOGS" class="column">';
        if(discogsDataCompile.labels !== undefined){
            discogsElement += '<a target="_blank" href="https://www.discogs.com/label/' + discogsDataCompile.labels[0].id + '">'
            + discogsDataCompile.labels[0].name
            + '</a>'
            + ' - ' 
            + discogsDataCompile.labels[0].catno
            + '</span>'
        }
        + '</p>'
        + '<p class="tracklistingHeader-DISCOGS">';
        
        trackListing += '<table class="tracklisting-DISCOGS"><tbody>';
        discogsDataCompile.tracklist.forEach( function (track)
        {   
            if(track.type_ == 'track'){
                trackListing += '<tr class="track">'; 
                if(track.position.length >= 1){
                    trackListing += '<td class="position">'
                    + track.position
                    + '</td>';
                }else{
                    trackListing += "<td></td>"
                }
                if(track.title.length >= 1){
                    trackListing += '<td class="title">'
                    + track.title
                    + ' ';
                    if(track.extraartists !== undefined){
                        trackListing += '<br><span class="extraArtists">';
                        track.extraartists.forEach(function(ea){
                            trackListing += '<a target="_blank" href="https://www.discogs.com/artist/'
                            + ea.id
                            + '">'
                            + ea.name
                            + '</a>'
                            + ' - '
                            + ea.role;
                        });
                        trackListing += '</span> ';
                    }
                }else{
                    trackListing += "<td>"
                } 
                if(track.duration.length >= 1){
                    trackListing += '('
                    + track.duration
                    + ')';
                }

                trackListing += '</td></tr>';
            }

            if(track.type_ == 'heading'){
                trackListing += '<tr class="heading">'; 
                if(track.position.length >= 1){
                    trackListing += '<td>'
                    + track.position
                    + '</td>';
                }else{
                    trackListing += "<td></td>"
                }
                if(track.title.length >= 1){
                    trackListing += '<td>'
                    + track.title;
                }else{
                    trackListing += "<td>"
                } 
                if(track.duration.length >= 1){
                    trackListing += '('
                    + track.duration
                    + ')';
                }
                trackListing += '</td></tr>';
            }
        });
        trackListing += '</tbody></table>';

        discogsElement += trackListing
        + '</p>'
        + '</p></div><div id="marketplace-DISCOGS"></div></div></div>';

        injectionPoint.insertAdjacentHTML('afterend', discogsElement);

        return injectionPoint;
    }

    function createMarketplaceModule(contentElement){
        var info = document.getElementById("marketplace-DISCOGS");


        // select 
        marketplaceElement = '<table class="tracklisting-DISCOGS">'
        + '<thead><td>Price</td><td>Ships From</td><td>Title</td><td>Condition</td></thead>'
        + '<tbody>'
        discogsDataCompile.marketplace.forEach( function (listing)
            {
                marketplaceElement += '<tr><td><a target="_blank" href="https://www.discogs.com/sell/item/' + listing.id + '">' + listing.price + '</a></td><td>'+ listing.ships_from +'</td><td>' + listing.title + '</td><td>' + listing.condition + '</tr>';
            });
        marketplaceElement += '</tbody>'
        + '<tfoot><tr><td colspan="3"><a target="_blank" href="';
        

        if(discogsData.type == 'masters'){
            marketplaceElement += 'https://www.discogs.com/sell/list?master_id=' + discogsData.id
        }
        if(discogsData.type == 'releases'){
            marketplaceElement += 'https://www.discogs.com/sell/release/'  + discogsData.id
        }

        marketplaceElement += '">See Listing Page</a></td></tfoot>'
        + '</table>';


        marketplaceElement += '</table>';
        info.innerHTML = marketplaceElement;
        return contentElement;
    }

    function initialize( contentElement ) {
        discogsData = new Object(),
        discogsMarketplace = new Array(),
        discogsDataCompile = new Object();
        injectionPoint = document.getElementById("watch-header");
        discogsLinks = collectLinks(contentElement);
        if(discogsLinks){
            collectDiscogsInfo(discogsLinks[0])
            .then(function(){
                createDiscogsElement(injectionPoint);
                collectMarketplaceInfo()
                .then(function(){
                    createMarketplaceModule(contentElement);
                });
            })
        }
    }

    function checkExist(){
        if (document.contains(document.getElementById("eow-description"))) {
            var description = document.getElementById("eow-description");
            discogsFetch.intervalCollection.forEach(function(interval){
                clearInterval(interval);
            });
            initialize(description);
            return true;
        }
    };

    var checkTimer = setInterval.bind(null, function() {
        discogsFetch.checkExist();
    }, 1000);


    var lastUrl, myInterval;
    var intervalCollection = new Array;

    return {
        init: initialize,
        checkExist: checkExist,
        checkTimer: checkTimer,
        myInterval: myInterval,
        intervalCollection: intervalCollection,
        lastUrl: lastUrl 
    };
})();



chrome.runtime.onMessage.addListener(    
    function(request, sender, sendResponse) {
        if(discogsFetch.lastUrl != request.tab.url){
            if (request.pageChange == true){
                discogsFetch.myInterval = discogsFetch.checkTimer();
                discogsFetch.intervalCollection.push(discogsFetch.myInterval);
                sendResponse({'complete': true, 'url': document.URL});
                discogsFetch.lastUrl = request.tab.url;
            }else{
                sendResponse({'complete': false, 'url': document.URL});
            }
        }
        
    }
);