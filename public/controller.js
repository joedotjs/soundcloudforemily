function startAppLogic() {

    var app = angular.module('BeatDrop', ['lazy-scroll'])

    app.controller('TrackCtrl', function($http, $scope, TrackFactory){

        TrackFactory.getProfile().then(function (me) {
            console.log(me);
            console.log(me.id.toString());

            TrackFactory.getFollowersTracks().then(function ( tracks){
              console.log("FOLLOWING", tracks)
              var DLtest = TrackFactory.extractFreeDownloads(tracks)
              console.log("DL TEST", DLtest)
              //embedTracks(tracks);
              TrackFactory.embedToTab('1', DLtest);
              $scope.tracks = DLtest
              console.log("tracks", $scope.tracks)
              $scope.hi = "HELLO"
              $scope.$digest();


              var url = TrackFactory.createDownloadURL(DLtest)

              var MSCTest = TrackFactory.extractMiscDownloads(tracks)
             // embedToTab('2', MSCTest);

              // var otherTracks = extractExtraDownloads(tracks)
              // embedToTab('3', otherTracks);

               $('.container').append('<a href=' + url + ' class="btn btn-primary btn-lg download">DOWNLOAD FREE TRACKS</a>')
            })
        }, function (err) {
            console.error(err);
        });




    })

    app.factory('TrackFactory', function($http){

         var TrackFactory = {}

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

}