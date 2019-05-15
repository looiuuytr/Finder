const http = require('http');
const express = require('express');
const app = express();
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');
const router = express.Router();

const spotifyApi = new SpotifyWebApi({
    accessToken: 'BQDmgWuDRx6dfR4c0LKWJP_DsXMmA_iMdYdL1oA_AtgGWDT8pvUJdXZBfYSR4JDAJ-tO-l3lEaj-wCxwVFbndj49MictbxaLRaXDnAIw34d-CyoUJyOUXxWEW8Od_46bypj73KNJi_tVzmOlUufZUccviuvZ5M27SGpqdpDHpAjVlho',
    clientId: '515a6059023f42dabdc11f7722a731e3',
    clientSecret: '9b362d17ab8e49e1bba81eec59e4fe9b',
});


router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

router.get('/musics', function(req, res) {
    res.sendFile(path.join(__dirname + '/musics.html'));
});

router.get('/search', function(req, res) {



    const apiRouteUrl = "http://api.musixmatch.com/ws/1.1/track.search?q_lyrics=";
    const params = "&page_size=20&page=1&s_track_rating=desc&apikey=5165cb025de6c85ef26ca5a8019c3c4e";

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

router.get('/play', function(req, res) {

    // Do search using the access token
    spotifyApi.searchTracks('track:' + req.query.name + ' artist:' + req.query.artist, { limit: 1, offset: 1 }).then(
        function(data) {
            if (data.body.tracks.items[0]) {
                res.send(data.body.tracks.items[0].uri);
            } else {
                res.send("");
            }

        },
        function(err) {
            console.log('Something went wrong!', err);
        }
    );
    return;


});

app.use('/', router);
app.use(express.static('public'));

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});