var fs = require('fs')
var request = require('request');
var swig = require('swig');
var path = require('path');
var archiver = require('archiver');
var archive = archiver.create('zip', {});

function downloadTracks(trackIDs){
    console.log("MADE IT HERE")
    console.log("counter", counter)
    console.log("trackIDS", trackIDs)
         if (typeof trackIDs !== "object"){ trackIDs = [trackIDs]}
         console.log("trackIDS", trackIDs)
    var counter = trackIDs.length;

         trackIDs.forEach( function(id) {
            console.log("IM THE ID", id)

            request('https://api.soundcloud.com/tracks/'+id+'?client_id=874fc7fe4c534db21ed6b7bc1462b731', function (error, response, body) {
                if (error){ console.log("YOU FUCKED UP")}
                    var parseBody = JSON.parse(body)
                     console.log("BODY", parseBody)
                     console.log("title", parseBody["title"])

                    var filePath = fs.createWriteStream(path.join(__dirname, './tracks/'+parseBody.title+'.mp4'));
                    var rem = request('https://api.soundcloud.com/tracks/'+parseBody.id+'/download?&client_id=874fc7fe4c534db21ed6b7bc1462b731');
                    console.log("PATH",filePath)

                    rem.on('data', function(chunk){
                          filePath.write(chunk);
                    }).on('end', function(){
                          filePath.end();
                          counter--
                          console.log("downloaded left", counter);
                          if (counter ===0 && trackIDs.length>1){ zipTracks()}
                       });
            });

       });
}

function zipTracks (){
  var output = fs.createWriteStream('myBeatDrop.zip');
  output.on('close', function() { console.log('done') });
  archive.on('error', function(err) { throw err });

  archive.pipe(output);

  archive.bulk([
    { expand: true, cwd: './tracks', src: ['**'] }
  ]).finalize();

}


module.exports = {
    downloadTracks: downloadTracks
}