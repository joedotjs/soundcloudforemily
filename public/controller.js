    var app = angular.module('BeatDrop', ['lazy-scroll'], function($interpolateProvider) {
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');
    });

    app.filter('trustUrl', function($sce) {
        return function(url) {
            return $sce.trustAsResourceUrl(url);
        };
    });

    app.controller('TrackCtrl', function($http, $scope, TrackFactory, $sce, $filter) {

        TrackFactory.initialize();
        TrackFactory.getProfile().then(function(me) {
            console.log(me);
            console.log(me.id.toString());
            $scope.profilePic = me.avatar_url;
            $('#product-table a:first').tab('show')
            TrackFactory.getFollowersTracks().then(function(tracks) {
                console.log("FOLLOWING", tracks)
                var DLtest = TrackFactory.extractFreeDownloads(tracks).sort(function( a, b){
                     console.log("a", a.user.username)
                     console.log("b", b.user.username)
                     console.log(a.user.username > b.user.username)
                     return a.user.username > b.user.username
                   })
                console.log("DL TEST", DLtest)




                $scope.tracks = DLtest;

                console.log("sorted", $scope.tracks)

                $scope.fileSize = TrackFactory.calcSize($scope.tracks)
                listedTracks = $scope.tracks
                $scope.hi = "HELLO"

                $scope.url = TrackFactory.createDownloadURL(DLtest)

                var MSCTest = TrackFactory.extractMiscDownloads(tracks)
                var start = 0;
                var ending = start + 2;
                var lastdata = $scope.tracks.length;
                var reachLast = false;

                $scope.loadmore = "Loading More data..";
                $scope.testData = [];
                $scope.filteredSelection = [];
                $scope.adjustDownloads = function() {
                    console.log("YOU UNTOGGLED ME")
                   $scope.fileSize = TrackFactory.calcSize($scope.tracks)
                   $scope.url = TrackFactory.createDownloadURL($scope.tracks)

                };



                $scope.listData = function() {
                    if (reachLast) {
                        return false;
                    }

                    var jsondt = [];
                    var scrolledTracks = $scope.tracks
                    for (var i = start; i < ending; i++) {
                        jsondt.push(scrolledTracks[i]);
                    };
                    start = i;
                    ending = i + 2;

                    $scope.testData = $scope.testData.concat(jsondt);
                    console.log("TEST DATA???", $scope.testData)
                    $scope.$digest();

                    if (ending >= lastdata) {
                        reachLast = true;
                        $scope.loadmore = "Reached at bottom";
                    }
                    console.log("load more", $scope.loadmore)
                };

                $scope.listData();


            })
        }, function(err) {
            console.error(err);
        });

    })

    app.factory('TrackFactory', function($http, $filter) {

        var TrackFactory = {}

        TrackFactory.initialize = function() {
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
        TrackFactory.getProfile = function() {
            return SC.get('/me')
        }

        TrackFactory.getFollowersTracks = function() {
            return SC.get('me/followings/tracks?limit=100000')
        }

        TrackFactory.extractFreeDownloads = function(tracks) {
            var freeDLs = []
            for (var track in tracks) {
                if (tracks[track].downloadable === true) {
                    // console.log("TRACK", tracks[track])
                    tracks[track].srcUrl = 'https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/' + tracks[track].id;
                    tracks[track].selected = true;
                    freeDLs.push(tracks[track])
                }
            }
            return freeDLs
        }

        TrackFactory.calcSize = function(tracks) {
            var size = 0
            console.log("calculating size!!")
            for (var track in tracks) {
                    // console.log("TRACK", tracks[track])
              if (tracks[track].selected){
                size+=tracks[track].original_content_size;
              }
            }
            size = Math.round((size / 1000000) * 100) / 100;
            console.log("size", size)
            return size
        }

        TrackFactory.extractMiscDownloads = function(tracks) {
            var miscDLs = []
            for (var track in tracks) {
                if (tracks[track].downloadable === false && tracks[track].purchase_url) {
                    miscDLs.push(tracks[track])
                }
            }
            return miscDLs
        }

        TrackFactory.extractExtraDownloads = function(tracks) {
            var otherTracks = []
            for (var track in tracks) {
                if (!tracks[track].downloadable && !tracks[track].purchase_url) {
                    otherTracks.push(tracks[track])
                }
            }
            return otherTracks
        }

        TrackFactory.embedToTab = function(tab, tracks) {
            for (var track in tracks) {
                // console.log("I AM IN EMBED")
                SC.oEmbed(tracks[track].permalink_url, {
                    auto_play: false
                }).then(function(embed) {
                    var embedBox = "<div class='track'><input type='checkbox' checked>" + embed.html + "</div>"
                    $('#' + tab).append(embedBox);
                });
            }
        }

        TrackFactory.createDownloadURL = function(tracks) {
            var url = "http://localhost:8080/tracks?";
            var appendStr = ""
            for (var track in tracks) {
                if (tracks[track].downloadable === true && tracks[track].selected) {
                    console.log("HERE", tracks[track])
                    if (appendStr.length === 0) {
                        appendStr += "ids=" + tracks[track].id;
                    } else {
                        appendStr += "&ids=" + tracks[track].id;
                    }
                }
            }
            url += appendStr;
            return url
        }

        return TrackFactory

    })