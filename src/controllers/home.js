// Home Controller

var express         = require('express'),
    HomeController  = express.Router(),
    User            = require(__dirname + '/../models/user'),
    bcrypt          = require('bcrypt');




////////////SIGN UP//////////////
HomeController.route('/signup/?')
  // GET sign up page
  .get(function(req, res, next) {
    res.render('signup', {})
  })
  .post(function(req, res, next) {
    bcrypt.hash(req.body.password, 10, function(err, hash) {
      // Fill In Model/Schema
      User.create({
      username: req.body.username,
      password: hash,
      email: req.body.email
      },
      function(err, user) {
        if (err) {
          console.log(err);
          res.render('signup', {error: err});
        } else {
            console.log(user);
            res.redirect('/search/');
        }
      })
    });
  });



// /////////////LOG IN//////////////
// HomeController.route('/user/:id/?')
  
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




//////////////HOME///////////////

HomeController.route('/?') 
  .get(function(req, res, next) {
    res.render('home', {})
  })
   .post(function(req, res, next) {
    // find user by username
    User.findOne({username: req.body.username}, function(error, user) {
      if (error || !user) {
        res.send('Could not find user');
      } else {
        // Compare the password send through the form. 
        bcrypt.compare(req.body.password, user.password, function(err, result) {
          if (err) {
            console.log(err)
            res.send('ERROR: ' + err);   // error in bcrypt ibrary itself
          }
          else if (result) {
            console.log(user)
            res.redirect('/search')

          } else {
            console.log('Wrong passwror')
            res.send('Wrong password!')
          }
        })
      }
    })
  })
 
 module.exports = HomeController;


