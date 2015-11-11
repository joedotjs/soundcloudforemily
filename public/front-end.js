if (typeof SOUNDCLOUDTOKEN === 'undefined') {
    SC.initialize({
        client_id: "75aef74799f5fd3149b69ea56c34462c", // YOUR CLIENT ID
        redirect_uri: "http://localhost:8080/soundcloud-auth"
    });
    SC.connect();
} else {
    SC.initialize({
        client_id: "874fc7fe4c534db21ed6b7bc1462b731", // YOUR CLIENT ID
        redirect_uri: "http://localhost:8080/soundcloud-auth",
        oauth_token: SOUNDCLOUDTOKEN
    });
    startAppLogic();
}

function startAppLogic() {

    // SC.oEmbed('http://soundcloud.com/spnn/orbital-halcyon-on-and-on', {
    //     auto_play: true
    // }).then(function(embed){
    //     $('body').append(embed.html);
    // });

    // SC.get('/user/183/tracks').then(function(tracks){
    //   console.log(tracks)
    // });


    SC.get('/me').then(function(myself){
      console.log(myself)
    });

    //SC.get('/resolve', :url => "http://soundcloud.com/dj_ches', :client_id => ENV['SOUNDCLOUD_ID'])

   // var recorder = new SC.Recorder();

   //  recorder.start();

   // setTimeout(function(){
   //  recorder.stop();
   //  recorder.play();

   //  }, 5000);


  }



