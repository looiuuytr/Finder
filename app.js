const http = require('http');
const express = require('express');
var app = express();
const path = require('path');
const router = express.Router();


router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
    //__dirname : It will resolve to your project folder.
});

app.use('/', router);
app.use(express.static('public'));

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});