function createDownloadURL(tracks){
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

          return url
}

function embedTracks(tracks){
  console.log("these are the tracks in embed", tracks)
for ( var track in tracks) {
                 // console.log("TRACK: " + track.title)
                 // console.log("TRACK_ID: " + tracks[track].id)
                   if (tracks[track].downloadable === true){
                     console.log("DOWNLOAD URL: " + '/tracks/'+ tracks[track].id + '/download?&client_id=874fc7fe4c534db21ed6b7bc1462b731')
                     var downloadURL = 'http://localhost:8080/tracks?ids='+ tracks[track].id

                     SC.oEmbed(tracks[track].permalink_url, {
                       auto_play: false
                     }).then(function(embed){
                       var embedBox = "<div class='track'>" + embed.html + "</div>"
                       $('.container').append(embedBox);
                       });
                  }
                }

}
