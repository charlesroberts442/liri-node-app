

// Pull in the packages we need
require("dotenv").config();
var fs = require('fs');
var request = require("request");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var keys = require("./keys.js");


var spotify = new Spotify(keys.spotify);
var twitter = new Twitter(keys.twitter);

/**
 * [doTwitter description]
 * @return {[type]} [description]
 */
function doTwitter()
{
    var params = {
		screen_name: 'AMan_442',
		count: '20',
		trim_user: false,
	};

	
	twitter.get('statuses/user_timeline', params, function(error, tweets, response){
		if(!error)
		{
			for(var tweet in tweets)
			{
				//this creates the variable tdate which will store the result of the date from the twitter call for easier access later
				var tDate = new Date(tweets[tweet].created_at);

				console.log("\nTweet #: " + (parseInt(tweet)+1) + " ");
				console.log(tDate);
				console.log(tweets[tweet].text);
				

			}

			console.log("\n");
		}

	});

} // End of doTwitter()

function doSpotify(songName)
{
	var processedSongName = "";
	if(songName.charAt(0) === "\"")
	{
		processedSongName = songName;
	}
	else
	{
		processedSongName = "\"" + songName + "\"";
	}
	
	spotify.search({ type: 'track', query: processedSongName, limit: 10 }, function(err, data) 
	{
  		if (err)
  		{
			return console.log('Error occurred: ' + err);
		}
 
		itemArray = data.tracks.items; 

		if(itemArray.length > 1)
		{
			console.log("\nSpotify found more than one instance of the song.");
			console.log("Here are the first few: \n" );
		}

		for (var i = 0; i<itemArray.length; i++)
		{	
			
	    	for (j=0; j<itemArray[i].artists.length; j++)
	    	{
	    		var processedName = ("\"" + itemArray[i].name + "\"");
	    		if(processedName.toUpperCase() == processedSongName.toUpperCase())
	    		{
		    	    console.log("Artist: " + itemArray[i].artists[j].name);
		        	console.log("Song Name: " + itemArray[i].name);
		        	console.log("Preview Link of the song from Spotify: " + itemArray[i].preview_url);
		        	console.log("Album Name: " + itemArray[i].album.name + "\n");
	            }
	    	
	    	} 

		}	
	}
);

} // End of doSpotify()  */

/**
 * [doImdb description]
 * @param  {[type]} movieName [description]
 * @return {[type]}           [description]
 */
function doImdb(movieName)
{
	

/**
 * [processResponse description]
 * @param  {[type]} error    [description]
 * @param  {[type]} response [description]
 * @param  {[type]} body     [description]
 * @return {[type]}          [description]
 */
	function processResponse(error, response, body)
	{
		if (!error && response.statusCode === 200) 
		{

		    // Parse the body of the site and recover just the imdbRating
		    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
		    obj = JSON.parse(body);
		    

		    console.log("\nMovie Title:  " + obj.Title);
		    console.log("\nMovie Year:  " + obj.Year);
		    console.log( "\nIMDB Rating:  " + obj.Ratings[0].Value);
		    console.log("\nCountry:  " + obj.Country);
		    console.log("\nLanguage:  " + obj.Language);
		    console.log("\nPlot:  " + obj.Plot);
		    console.log("\nActors:  " + obj.Actors + "\n");
		    

  		}
	}

	request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy", processResponse);

} // End of doImdb(movieName)

function doString()
{
	function readFileCallback(err, data)
	{
		var array = data.split(",");
		var i = 0;

		main(array[0], array[1].trim());

	} // End of readFileCallback()

	fs.readFile('random.txt', 'utf-8', readFileCallback);


} // End of doString()

function main(action, parameter)
{

	switch(action)
	{
		case "my-tweets":
			doTwitter();
			break;

		case "spotify-this-song":

			if( (parameter !== undefined) &&
				(parameter !== null)      )
			{
				var str = parameter;
				doSpotify(str);
			}
			else
			{
				doSpotify("The Sign")
			}
			
			break;

		case "movie-this":
			if( (parameter !== undefined) &&
				(parameter !== null)      )
			{
				doImdb(parameter);
			}
			else
			{
				doImdb("Mr Nobody");
			}
			break;

		case "do-what-it-says":
			doString();
			break;

		default:
			console.log("I'm in default");

	}
}

var str2 = process.argv[2];
var str3 = process.argv[3];
main(str2,str3);
