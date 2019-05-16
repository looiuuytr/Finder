const http = require('http');
const express = require('express');
const app = express();
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');
const router = express.Router();

const spotifyApi = new SpotifyWebApi({
    clientId: '515a6059023f42dabdc11f7722a731e3',
    clientSecret: '9b362d17ab8e49e1bba81eec59e4fe9b',
    redirectUri: 'http://localhost:3000/callback'
});

var scopes = ['user-top-read'];
var showDialog = true;
var authorizeURL = spotifyApi.createAuthorizeURL(scopes, null, showDialog);

app.get("/callback", async function (request, res) {
    var authorizationCode = request.query.code;
    const data = await spotifyApi.authorizationCodeGrant(authorizationCode);

    try{
        spotifyApi.setAccessToken(data.body.access_token);
        res.redirect('/home');
        }catch(err){
            console.log('Something went wrong when retrieving the access token!', err.message);
        }
    
        return;


  });
  

router.get('/', function(req, res) {
    if (spotifyApi.getAccessToken() === undefined) {
        res.redirect(authorizeURL);
    } else {
        res.redirect("/home");
    }

});

router.get('/home', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
router.get('/musics', function(req, res) {
    if (spotifyApi.getAccessToken() === undefined) {
        res.redirect(authorizeURL);
    } else    res.sendFile(path.join(__dirname + '/musics.html'));
});

router.get('/search', function(req, res) {

    if (spotifyApi.getAccessToken() === undefined) {
        res.redirect(authorizeURL);
    }

    const apiRouteUrl = "http://api.musixmatch.com/ws/1.1/track.search?q_lyrics=";
    const params = "&page_size=15&page=1&s_track_rating=desc&apikey=5165cb025de6c85ef26ca5a8019c3c4e";

    let tracks;

    http.get(apiRouteUrl + req.query.searchBar + params, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            tracks = JSON.parse(data).message.body.track_list;
            res.send(tracks);


        });

    }).on("error", (err) => {
        //console.log("Error: " + err.message);
    });



});

router.get('/play', async function(req, res) {

    try{
    // Do search using the access token
    const data = await spotifyApi.searchTracks('track:' + req.query.name + ' artist:' + req.query.artist , { limit: 1 });

    if (data.body.tracks.items[0]) {
        res.send(data.body.tracks.items[0].uri);
    } else {
        res.send("");
    }

    }catch(err){
        console.log(err)
    }

    return;

});

app.use('/', router);
app.use(express.static('public'));

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});