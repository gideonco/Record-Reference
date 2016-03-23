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

    function createDiscogsElement(injectionPoint){
        console.log('createDiscogsElement');

        var trackListing = "";
            

        discogsElement = '<div class="yt-card yt-card-has-padding"><div id="collectContainer-DISCOGS" class="column"><div id="information-DISCOGS"><p><h2><a target="_blank" href="https://www.discogs.com/artist/'
        + discogsDataCompile.artists[0].id
        + '">'



        if(discogsDataCompile.artists[0].anv.length < 1){
            if(discogsDataCompile.artists[0].name.length < 1){
                discogsElement += 'Unknown Artist';
            }else{
                discogsElement += discogsDataCompile.artists[0].name;
            }
            discogsElement += discogsDataCompile.artists[0].anv;
        } 

        discogsElement += '</a> - '
        + '<a target="_blank" href="' + discogsLinks[0] + '">'
        + discogsDataCompile.title 
        + '</a>'
        + '</h2>'
        + '<span class="label-DISCOGS" class="column">'
        + '<a target="_blank" href="https://www.discogs.com/label/' + discogsDataCompile.labels[0].id + '">'
        + discogsDataCompile.labels[0].name
        + '</a>'
        + ' - ' 
        + discogsDataCompile.labels[0].catno
        + '</span>'
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
        console.log('createMarketplaceModule');
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
                    console.log("FINAL FINISH");
                });
            })
        }
    }

    return {
        init: initialize
    };
})();

var checkExist = setInterval(function() {
    if (document.getElementById("eow-description")) {
        var description = document.getElementById("eow-description");
        discogsFetch.init(description);
        clearInterval(checkExist);
    }

}, 100); // check every 100ms

checkExist;