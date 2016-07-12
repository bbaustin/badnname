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
    //   if (req.body.password === null) {
    //     res.send('Please enter a password')
    //   }
    // else {
      bcrypt.hash(req.body.password, 10, function(err, hash) {
      // Create new document based on User Schema
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
            console.log(user)
            res.redirect('/search')
        }
      })
    })
  // }
  });





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
        // Compare the password sent through the form. 
        bcrypt.compare(req.body.password, user.password, function(err, result) {
          if (err) {
            console.log(err)
            res.send('ERROR: ' + err);   // error in bcrypt library itself
          }
          else if (result) {
            console.log(user)
            res.redirect('/search')

          } else {
            console.log('Wrong password')
            res.send('Wrong password!')
          }
        })
      }
    })
  })
 
 module.exports = HomeController;


