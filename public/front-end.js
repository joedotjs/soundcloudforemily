
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
    SC.get('/me').then(function (me) {
        console.log(me);
        console.log(me.id.toString());

        SC.get('me/followings/tracks?limit=100000').then(function ( tracks){
          console.log("FOLLOWING", tracks)
          embedTracks(tracks);
          var url = createDownloadURL(tracks)

           $('.container').append('<a href=' + url + ' class="btn btn-primary btn-lg download">MASS TEST BUTTON</a>')
        })
    }, function (err) {
        console.error(err);
    });

    $('body').on('click', '.download', function(){
        console.log("THIS DID SOMETHING")
    })

}



