// Home Controller

var express         = require('express'),
    HomeController  = express.Router(),
    User            = require(__dirname + '/../models/user'),
    bcrypt          = require('bcrypt');

// HomeController.route('/:id/?')
  
//   .get(function(req, res) {
//     User.findById(req.params.id, function(err, user) {
//       if(err) {
//         console.log(err);
//         res.send('There was an error with your UserID GET request');
//       }
//       else {
//         res.json(user);
//       }
//     });
//   });


HomeController.route('/?')
///////////////////////////////////  
  .get(function(req, res, next) {
    res.render('home', {})
  });
 
 module.exports = HomeController;
