
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
    });
    
    return false;
};

$('#form-container').submit(loadData);

// loadData();
