const http = require('http');
const express = require('express');
var app = express();
const path = require('path');
const router = express.Router();


router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

router.get('/musics', function(req, res) {
    res.sendFile(path.join(__dirname + '/musics.html'));
});

router.get('/search', function(req, res) {

    //res.sendFile(path.join(__dirname + '/musics.html'));


    const apiRouteUrl = "http://api.musixmatch.com/ws/1.1/track.search?q_lyrics=";
    const params = "&page_size=10&page=1&s_track_rating=desc&apikey=5165cb025de6c85ef26ca5a8019c3c4e";

    var tracks;

    http.get(apiRouteUrl + req.query.searchBar + params, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            tracks = JSON.parse(data).message.body.track_list;
            console.log(tracks);
            res.send(tracks);


        });

    }).on("error", (err) => {
        //console.log("Error: " + err.message);
    });



});

app.use('/', router);
app.use(express.static('public'));

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});