var server = require('http').createServer();
var express = require('express');
var bodyParser = require('body-parser');
var expressApp = express();

var ACCESS_TOKEN = null;

server.on('request', expressApp);
server.listen(8080, function () {
    console.log('Server listening on port 8080!');
});

var sc = require('soundclouder');

sc.init(
    '874fc7fe4c534db21ed6b7bc1462b731', // YOUR CLIENT ID
    '89a8fe353d29e7070a054e44a394f5a9', // YOUR CLIENT SECRET
    'http://localhost:8080/soundcloud-auth' // SET THIS REDIRECT URI IN SOUNDCLOUD
);

var swig = require('swig');

// where to find files to render
expressApp.set('views', __dirname + '/views');
// what kind of files to render
expressApp.set('view engine', 'html');
// how to render 'html' files
expressApp.engine('html', swig.renderFile);
// caching off
swig.setDefaults({ cache: false });

expressApp.use(express.static(__dirname + '/public'));
expressApp.use(express.static(__dirname + '/node_modules'));
expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(bodyParser.json());

expressApp.get('/', function (req, res) {
    res.render('index', {
        soundcloudAccessToken: ACCESS_TOKEN
    });
});

expressApp.get('/soundcloud-auth', function (req, res) {

    var code = req.query.code;
    // authorize and get an access token
    console.log("CODE: " + code)
     console.log("Query: " + req.query)

    sc.auth(code, function (error, access_token) {
        if (error) {
            console.error(error.message);
        }
        ACCESS_TOKEN = access_token;

        res.render('callback');
    });

});
