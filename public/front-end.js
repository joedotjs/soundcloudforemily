
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

var userUrl = 'https://soundcloud.com/bonnieandclydeofficial';

$.get('http://api.soundcloud.com/resolve.json?url=' + userUrl + '&client_id=874fc7fe4c534db21ed6b7bc1462b731'  , function (result) {
  console.log("RESULT: " + result.id);
  return result;
  })
  .then(function(user) {
    console.log("I HAVE THE ID: " + user.id) ;
    SC.get('/users/' + user.id+ '/tracks')
    .then(function (tracks) {
        console.log(tracks);
         // appends all tracks
         var url = "http://localhost:8080/tracks?";
         var appendStr = ""
          for ( var track in tracks) {
              console.log(track==0)
              if (tracks[track].downloadable === true){
                 if (appendStr.length === 0 ) {
                  appendStr+= "ids="+ tracks[track].id;
                } else {
                  appendStr+= "&ids="+ tracks[track].id;
                }
              }
          }
          url+= appendStr;

           $('body').append('<a href=' + url + ' class="button">TEST BUTTON</a>')

         for ( var track in tracks) {
           console.log("TRACK: " + track)
           console.log("TRACK_ID: " + tracks[track].id)
           if (tracks[track].downloadable === true){
              console.log("DOWNLOAD URL: " + '/tracks/'+ tracks[track].id + '/download?&client_id=874fc7fe4c534db21ed6b7bc1462b731')
            //  $('body').append('<a href="http://localhost:8080/test" class="button">Download</a>')

              SC.oEmbed(tracks[track].permalink_url, {
                auto_play: false
              }).then(function(embed){
              $('body').append('<a href="http://localhost:8080/test" class="button">Download</a>')
                  $('body').append(embed.html);
                });
           }
        }
      });
  });





}



