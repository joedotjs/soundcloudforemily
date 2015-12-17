var https = require('https')
var server = require('http').createServer();
var express = require('express');
var bodyParser = require('body-parser');
var expressApp = express();
var router = express.Router();
var Qs = require('qs');
var async = require('async')
var fs = require('fs')
var request = require('request');
var swig = require('swig');
var path = require('path');
var trackFuncs = require('./track_funcs.js');


var ACCESS_TOKEN = null;

server.on('request', expressApp);
server.listen(8080, function () {
    console.log('Server listening on port 8080!');
});

// where to find files to render
expressApp.set('views', __dirname + '/views');
// what kind of files to render
expressApp.set('view engine', 'html');
// how to render 'html' files
expressApp.engine('html', swig.renderFile);
// caching off
swig.setDefaults({cache: false});

expressApp.use(express.static(__dirname + '/public'));
expressApp.use(express.static(__dirname + '/node_modules'));
expressApp.use(bodyParser.urlencoded({extended: true}));
expressApp.use(bodyParser.json());

expressApp.use(function (err, req, res, next) {
    console.log(chalk.magenta('      ' + err.message));
    res.status(err.status || 500).end();
});

expressApp.get('/', function (req, res) {
    console.log("THIS IS A TEST FOR expressApp")

    res.render('index', {
        soundcloudAccessToken: ACCESS_TOKEN
    });

});

expressApp.get('/soundcloud-auth', function (req, res) {

    var code = req.query.code;

    request.post({
        url: 'https://api.soundcloud.com/oauth2/token',
        form: {
            client_id: '7884b7ac8cb115055b529125293e9d89',
            client_secret: '72196ded3cd2578deb33847a85eab0d8',
            redirect_uri: 'http://localhost:8080/soundcloud-auth',
            grant_type: 'authorization_code',
            code: code
        }
    }, function (err, response) {

        if (err) {
            return console.error(err);
        }

        ACCESS_TOKEN = JSON.parse(response.body).access_token;
        console.log("ACCESS TOKEN: " + ACCESS_TOKEN)

        if (typeof ACCESS_TOKEN === 'undefined') {
            auth();
        } else {
            res.redirect('/');
        }
    });
});


expressApp.get('/tracks', function (req, res, next) {
    console.log("IM TRYING TO GET TRACKS");
    console.log(req.query.ids)

    var trackNum = 1
    async.parallel([ function(callback) {
      trackFuncs.downloadTracks(req.query.ids);
          callback();
      }], function done(err, results) {
            if (err) { throw err; }
             res.end("\nDone!");
      })

});
