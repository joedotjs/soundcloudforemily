if (typeof SOUNDCLOUDTOKEN === 'undefined') {
    SC.initialize({
        client_id: "75aef74799f5fd3149b69ea56c34462c", // YOUR CLIENT ID
        redirect_uri: "http://localhost:8080/soundcloud-auth"
    });
    SC.connect();
} else {
    SC.initialize({
        client_id: "75aef74799f5fd3149b69ea56c34462c", // YOUR CLIENT ID
        redirect_uri: "http://localhost:8080/soundcloud-auth",
        oauth_token: SOUNDCLOUDTOKEN
    });
    startAppLogic();
}

function startAppLogic() {

    SC.oEmbed('http://soundcloud.com/spnn/orbital-halcyon-on-and-on', {
        auto_play: true
    }).then(function(embed){
        $('body').append(embed.html);
    });

}



