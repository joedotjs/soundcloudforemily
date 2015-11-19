var Qs = require('qs');
var async = require('async')

console.log(Qs.parse('a%5Bb%5D=c'));
console.log(Qs.parse('ids=1&ids=2'));

locals = {}
async.parallel([
        //Load user
        function(callback) {
           locals.user = {
                    name: 1,
                    email: 2,
                    bio: 3
                };
           callback()
        },
        //Load posts
        function(callback) {
           locals.user2 = {
                    name: 1,
                    email: 2,
                    bio: 3
                };
           callback()
        }
    ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
        if (err) return next(err); //If an error occured, we let express/connect handle it by calling the "next" function
        //Here locals will be populated with 'user' and 'posts'
        // res.render('user-profile', locals);
        console.log(locals);
    });