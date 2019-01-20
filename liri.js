

require("dotenv").config();
var axios = require("Axios");
var moment = require("moment");
var keys = require("./keys.js");
var fs = require("fs");
var request = require("request"); 

var omdb = keys.omdb.key;
var bitKey = keys.bit.key;
var Spotify = require('node-spotify-api');


var spotify = new Spotify(keys.spotify);


function firstRun() {
    var searchPoint = process.argv[2];
    var search = process.argv[3];
    dataBase(searchPoint, search)
}

function dataBase(searchPoint, search) {

    switch (searchPoint) {
        case "spotify-this-song":
            {
                searchSpotify(search);
            }
            break;

        case "concert-this":
            {
                searchBands(search)
            }
            break;

        case "movie-this":
            {
                searchOMDB(search)
            }
            break;

        case "do-what-it-says":
            {
                sayWhat(search);
            }
            break;

        default:
            {
                console.log("Not Found")
            }
    }
}


function searchSpotify(search) {

    spotify.search({
        type: 'track',
        query: search
    }, function (error, data) {
        if (error) {
            return console.log('Error occurred: ' + error);
        }
        var results = data.tracks.items[0];
        console.log(results.name)
        console.log(results.href)
        console.log(results.album.name)
    });
}

function searchBands(search) {
    axios.get("https://rest.bandsintown.com/artists/" + search + "/events?app_id=" + bitKey)
        .then(function (response) {
            resp = response.data
            for (i = 0; i < resp.length; i++) {
                console.log("Venue: " + resp[i].venue.name);
                console.log("Location: " + resp[i].venue.city);
                var convertedDate = moment(resp[i].datetime, "YYYY-MM-DD").format("MM/DD/YYYY")
                console.log("Date: " + convertedDate);
                console.log("______________________");
            }
        })
        .catch(function (error) {
            console.log(error);
        });



}

function searchOMDB(search) {
    axios.get('http://www.omdbapi.com/?apikey=' + omdb + '&t=' + search)
        .then(function (response) {
            if (search = "") {
                search = "Mr. Nobody"
            }
            resp = response.data
            console.log(resp.Title);
            console.log(resp.Year);
            console.log(resp.Ratings[1].Value);
            console.log(resp.Country);
            console.log(resp.Language);
            console.log(resp.Plot);
            console.log(resp.Actors);


        })
        .catch(function (error) {
            console.log(error);
        });
}

function sayWhat() {

    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        var searchPoint = dataArr[0];
        var search = dataArr[1];
        dataBase(searchPoint, search)
    })

}

firstRun()