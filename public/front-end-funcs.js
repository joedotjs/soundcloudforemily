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

}