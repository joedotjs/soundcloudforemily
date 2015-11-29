//async attempt
    // async.parallel([
    //     //Load user
    //     function(callback) {
    // request('https://api.soundcloud.com/tracks/' + '228704525' + '/download?&client_id=874fc7fe4c534db21ed6b7bc1462b731').pipe(res);

    //        callback()
    //     },
    //     //Load posts
    //     function(callback) {
    // request('https://api.soundcloud.com/tracks/' + '228704525' + '/download?&client_id=874fc7fe4c534db21ed6b7bc1462b731').pipe(res);

    //        callback()
    //     }
    // ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
    //     if (err) return next(err); //If an error occured, we let express/connect handle it by calling the "next" function
    //     //Here locals will be populated with 'user' and 'posts'
    //     // res.render('user-profile', locals);
    //     console.log("DONE");
    // });


var completed_requests = 0;

urls.forEach(function(url) {
  var responses = [];
  https.get(url, function(res) {
    res.on('data', function(chunk){
      responses.push(chunk);
    });

    res.on('end', function(){
      if (completed_requests++ == urls.length - 1) {
        // All downloads are completed
        console.log('body:', responses);
        return "SUCCESS"
      }
    });
  });
})