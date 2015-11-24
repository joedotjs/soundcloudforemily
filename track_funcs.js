function downloadTracks(trackIDs){
console.log("MADE IT HERE")
     trackIDs.forEach( function(id) {
          var filePath = fs.createWriteStream(path.join(__dirname, './tracks/myTrack'+trackNum+'.mp4'));
          var rem = request('https://api.soundcloud.com/tracks/'+id+'/download?&client_id=874fc7fe4c534db21ed6b7bc1462b731');
              console.log("trackNUM", trackNum)
              console.log("ID", id)
              console.log("PATH",filePath)

          rem.on('data', function(chunk){
              filePath.write(chunk);
          }).on('end', function(){
                filePath.end();
                console.log("downloaded")
          });
              trackNum+=1;
      });

}


module.exports = {
    downloadTracks: downloadTracks
}