    var app = angular.module('BeatDrop', ['lazy-scroll'],function ($interpolateProvider) {
                $interpolateProvider.startSymbol('[[');
                $interpolateProvider.endSymbol(']]');
    });

    app.filter('trustUrl', function ($sce) {
      return function(url) {
        return $sce.trustAsResourceUrl(url);
      };
    });

    app.controller('TrackCtrl', function($http, $scope, TrackFactory, $sce, $filter){




    //   var iframeElement   = document.querySelector('iframe#testWidget');
    //   console.log("iframe", iframeElement)
    //   var iframeElementID = iframeElement.id;
    //   var widget1         = SC.Widget(iframeElement);
    // //  var widget2         = SC.Widget(iframeElementID);
    //   console.log("widget", widget1.getDuration())
    //   widget1.play()

       $(document).ready(function(){
          var widgetIframe = document.getElementById('testWidget'),
        widget       = SC.Widget(widgetIframe),
        newSoundUrl = 'http://api.soundcloud.com/tracks/13692671';
        console.log("new widget", widget)
        widget.bind(SC.Widget.Events.READY, function() {
          // load new widget
          console.log("here")
           widget.play();

          widget.bind(SC.Widget.Events.FINISH, function() {
            widget.load(newSoundUrl, {
              show_artwork: false
            })
            console.log("widget!!")
          });
        });
      })

        TrackFactory.initialize();
        TrackFactory.getProfile().then(function (me) {
            console.log(me);
            console.log(me.id.toString());
            $('#product-table a:first').tab('show')
            TrackFactory.getFollowersTracks().then(function ( tracks){
              console.log("FOLLOWING", tracks)
              var DLtest = TrackFactory.extractFreeDownloads(tracks)
              console.log("DL TEST", DLtest)
              //embedTracks(tracks);
             // TrackFactory.embedToTab('1', DLtest);
              $scope.tracks = DLtest
              listedTracks = $scope.tracks
              console.log("tracks", $scope.tracks)
              $scope.hi = "HELLO"
              $scope.$digest();


              var url = TrackFactory.createDownloadURL(DLtest)

              var MSCTest = TrackFactory.extractMiscDownloads(tracks)
             // embedToTab('2', MSCTest);

              // var otherTracks = extractExtraDownloads(tracks)
              // embedToTab('3', otherTracks);

      $('.container').append('<a href=' + url + ' class="btn btn-primary btn-lg download">DOWNLOAD FREE TRACKS</a>')

       var start = 0;
       var ending = start+2;
       var lastdata = $scope.tracks.length;
       var reachLast = false;

      $scope.loadmore = "Loading More data..";
      $scope.testData = [];

       $scope.listData = function() {

          if(reachLast){
             return false;
          }

            var jsondt = [];
            var scrolledTracks = $scope.tracks
            console.log("test tracks", $scope.tracks)
             console.log("start", start)
             console.log("end", ending)
            for (var i = start; i < ending; i++) {
                jsondt.push(scrolledTracks[i]);
            };
                start = i;
                ending = i+ 2;

             $scope.testData =$scope.testData.concat(jsondt);
              console.log("TEST DATA???", $scope.testData)

               if(ending >= lastdata) {
                   reachLast = true;
                   $scope.loadmore = "Reached at bottom";
               }
               console.log("load more", $scope.loadmore)
               $scope.$digest()
      };

        $scope.listData();


            })
        }, function (err) {
            console.error(err);
        });

  })

    app.controller('testController', function($scope){
        var start = 0;
    var ending = start+2;
    var lastdata = 100;
    var reachLast = false;

    $scope.loadmore = "Loading More data..";
     $scope.testData = [];


     $scope.listData = function() {
         if(reachLast){
             return false;
         }
        var jsondt = [];
        var tracks = $scope.tracks
            for (var i = start; i < ending; i++) {
                jsondt.push(tracks[i]);
                };
                start = i;
                ending = i+4;

             $scope.testData =$scope.testData.concat(jsondt);


                     if(ending >= lastdata) {
                         reachLast = true;
                         $scope.loadmore = "Reached at bottom";
                     }
            };


        $scope.listData();


    })

    app.factory('TrackFactory', function($http, $filter){

         var TrackFactory = {}

         TrackFactory.initialize = function(){
          if (typeof SOUNDCLOUDTOKEN === 'undefined') {
            var redirectUrl = 'https://api.soundcloud.com/connect?';
            redirectUrl += 'client_id=7884b7ac8cb115055b529125293e9d89&';
            redirectUrl += 'redirect_uri=http://localhost:8080/soundcloud-auth&';
            redirectUrl += 'response_type=code';
            window.location.href = redirectUrl;
          } else {
            SC.initialize({
                client_id: "7884b7ac8cb115055b529125293e9d89", // YOUR CLIENT ID
                redirect_uri: "http://localhost:8080/soundcloud-auth",
                oauth_token: SOUNDCLOUDTOKEN
            });
          }

         }
         TrackFactory.getProfile = function(){
              return SC.get('/me')
         }

         TrackFactory.getFollowersTracks = function(){
              return SC.get('me/followings/tracks?limit=100000')
         }

         TrackFactory.extractFreeDownloads = function(tracks){
             var freeDLs = []
             for ( var track in tracks) {
                if (tracks[track].downloadable === true){
                  // console.log("TRACK", tracks[track])
                     tracks[track].srcUrl = 'https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/'+ tracks[track].id;
                     freeDLs.push(tracks[track])
                  }
            }
               return freeDLs
          }

         TrackFactory.extractMiscDownloads = function(tracks){
             var miscDLs = []
             for ( var track in tracks) {
                if (tracks[track].downloadable === false && tracks[track].purchase_url){
                     miscDLs.push(tracks[track])
                  }
            }
               return miscDLs
          }

         TrackFactory.extractExtraDownloads = function(tracks){
             var otherTracks = []
             for ( var track in tracks) {
                if (!tracks[track].downloadable  && !tracks[track].purchase_url){
                     otherTracks.push(tracks[track])
                  }
             }
               return otherTracks
         }

         TrackFactory.embedToTab = function(tab, tracks){
              for ( var track in tracks) {
                // console.log("I AM IN EMBED")
                  SC.oEmbed(tracks[track].permalink_url, {
                    auto_play: false
                  }).then(function(embed){
                    var embedBox = "<div class='track'>" + embed.html + "</div>"
                    $('#' + tab).append(embedBox);
                    });
              }
         }

         TrackFactory.createDownloadURL = function(tracks){
           var url = "http://localhost:8080/tracks?";
           var appendStr = ""
            for ( var track in tracks) {
                if (tracks[track].downloadable === true){
                   if (appendStr.length === 0 ) {
                    appendStr+= "ids="+ tracks[track].id;
                  } else {
                    appendStr+= "&ids="+ tracks[track].id;
                  }
                }
            }
            url+= appendStr;
            return url
         }

      return TrackFactory

    })

