
console.log(typeof SOUNDCLOUDTOKEN);

if (typeof SOUNDCLOUDTOKEN === 'undefined') {
    var redirectUrl = 'https://api.soundcloud.com/connect?';
    redirectUrl += 'client_id=874fc7fe4c534db21ed6b7bc1462b731&';
    redirectUrl += 'redirect_uri=http://localhost:8080/soundcloud-auth&';
    redirectUrl += 'response_type=code';
    window.location.href = redirectUrl;
} else {
    SC.initialize({
        client_id: "874fc7fe4c534db21ed6b7bc1462b731", // YOUR CLIENT ID
        redirect_uri: "http://localhost:8080/soundcloud-auth",
        oauth_token: SOUNDCLOUDTOKEN
    });
    startAppLogic();
}

function startAppLogic() {

    // SC.get('/me').then(function (me) {
    //     console.log(me);
    // }, function (err) {
    //     console.error(err);
    // });

var trackUrl = 'https://soundcloud.com/dj_ches';

// SC.get( '/resolve.json?url=' + trackUrl + '&client_id=874fc7fe4c534db21ed6b7bc1462b731'  ,
//   function (result) {
//     console.log(result);
//   }
// );

$.get('http://api.soundcloud.com/resolve.json?url=' + trackUrl + '&client_id=874fc7fe4c534db21ed6b7bc1462b731'  , function (result) {
  console.log("RESULT: " + result.id);
  return result;
  })
  .then(function(id) {
    console.log("I HAVE THE ID: " + id.id) ;
    SC.get('/users/' + id.id+ '/tracks')
    .then(function (tracks) {
        console.log(tracks);

         for ( var track in tracks) {
         console.log("TRACK: " + track)
         SC.oEmbed(tracks[track].permalink_url, {
         auto_play: false
         }).then(function(embed){
        $('body').append(embed.html);
           });
      }

      });
  });


//     SC.oEmbed(tracks[0].permalink_url, {
// +        auto_play: true
// +    }).then(function(embed){
// +        $('body').append(embed.html);
// +    });

// var getComments = function (track) {
//   return SC.get('/tracks/' + track.id + '/comments');
// };

// var listComments = function (comments) {
//   comments.forEach(function(comment){
//     console.log(comment.body);
//   });
// };

// SC.resolve(track_url).then(getComments).then(listComments);



}



