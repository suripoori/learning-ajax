
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var street = $('#street').val();
    var city = $('#city').val();
    var address = street + ", " + city;
    
    $greeting.text("So you want to live at " + address + "?");
    var streetViewUrl = "https://maps.googleapis.com/maps/api/streetview?size=600x300&location=";
    var completeUrl = streetViewUrl + address;
    
    $body.append('<img class="bgimg" src="' + completeUrl + '">');
    //console.log(street);
    //console.log(city);
    //console.log(secrets["article-search-api"]);
    $.getJSON("http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + city + "&sort=newest&api-key=" + secrets["article-search-api"], 
              function (data) {
            console.log(data);
            $.each( data.response.docs, function(index) {
                console.log(data.response.docs[index].snippet);
                $("#nytimes-articles").append( "<li class='article'><a href='" + data.response.docs.web_url + "'>" + 
                                              data.response.docs[index].headline.main + "</a>" + 
                                              "<p>" + data.response.docs[index].snippet + "</p></li>" );
                
            });
    }).fail(function(err) {
        console.log("Hit error");
        $("#nytimes-articles").append("<li class='error'><p>Unable to load NYTimes data</p></li>");
    });
    
    city = city.replace(" ", "_");
    var remoteUrlWithOrigin = "http://en.wikipadfdaedia.org/w/api.php?action=opensearch&search=" + city + "&format=json&callback=wikiCallback";
    var link = "https://en.wikipedia.org/wiki/" + city;
    var wikiTimeout = setTimeout(function(){
        $wikiElem.append('<li>Could not obtain wiki articles</li>');
    }, 10000);
    $.ajax( {
        url: remoteUrlWithOrigin,
        dataType: "jsonp",
        //Use done instead of success as success is deprecated as of 1.8
        done: function (data) {
            console.log(data);
            var articleList = data[1]
            for(var i=0; i<articleList.length; i++) {
                var url = "http://en.wikipedia.org/wiki/" + articleList[i];
                $wikiElem.append('<li><a href="' + url + '">' + articleList[i] + '</a></li>');
            };
            clearTimeout(wikiTimeout);
        }
        // apparently Jsonp error handling is more complicated because of the response coming back as a function
        //error: function (errorMessage) {
        //    $wikiElem.append('<li>Could not obtain wiki articles</li>');
        //}
    } );

    return false;
};

$('#form-container').submit(loadData);

// loadData();
