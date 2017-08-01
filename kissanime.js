var URL = window.location.origin

var episodeLinks = $('table.listing a').map(function(i,el) { return $(el).attr('href'); });

$.ajaxSetup({async:false});
$.getScript("http://kissanime.ru/Scripts/asp.js");

var login = "vergo777";
var api_key = "R_6a13f014b38f4f80a31cf7d80a7c18c7";
var long_url; 

var startEpisode; 
do {
	startEpisode = prompt("Enter episode number you want to start from");
	if(startEpisode <= 0 || startEpisode > episodeLinks.length) {
		alert("Episode number entered must be greater than 0 and lesser than total number of eps"); 
	} else {
		break; 
	}
} while(true); 

var endEpisode; 
do {
	endEpisode = prompt("Enter episode number you want to end at");
	if(endEpisode <= 0 || endEpisode > episodeLinks.length || endEpisode < startEpisode) {
		alert("Episode number entered must be greater than 0 and lesser than total number of eps");
	} else {
		break;
	}
} while(true); 
var videoQuality = prompt("Enter video quality you want to download. Example - '960x720.mp4' (without the quotes)"); 

var i; 
for (i = (episodeLinks.length - startEpisode); i >= (episodeLinks.length - endEpisode); i--) {
	jQuery.ajax({
         url:    URL + episodeLinks[i], 
         success: function(result) {
                    var $result = eval($(result));
					var stringStart = result.search("var wra"); 
					var stringEnd = result.search("document.write"); 
					var javascriptToExecute = result.substring(stringStart, stringEnd);
					eval(javascriptToExecute);
					
					$("body").append('<div id="episode' + i + '" style="display: none;"></div>')
					$('#episode' + i).append(wra); 
					
					var downloadQualityOptions = $('#episode' + i + ' a').map(function(i,el) { return $(el); });
					var j; 
					for(j = 0; j < downloadQualityOptions.length; j++) {
						if(videoQuality === downloadQualityOptions[j].html()) {
							long_url = downloadQualityOptions[j].attr('href');
							console.log(i); 
							get_short_url(long_url, login, api_key);
						}
					}
                  },
         async:   false, 
		 script:  true
    });       
}


function get_short_url(long_url, login, api_key)
{
    $.getJSON(
        "http://api.bitly.com/v3/shorten?callback=?", 
        { 
            "format": "json",
            "apiKey": api_key,
            "login": login,
            "longUrl": long_url, 
			async: true
        },
        function(response)
        {
            console.log(response.data.url);
        }
    ); 
}
