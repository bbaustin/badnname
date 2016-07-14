// Home Controller
var express         = require('express'),
    HomeController  = express.Router(),
    User            = require(__dirname + '/../models/user'),
    bcrypt          = require('bcrypt'),
    session         = require('express-session');
       

// LOGOUT PAGE
HomeController.route('/logout/?')
.get(function(req, res, next) {
  // End session
  req.session.destroy();
  console.log(req.session, 'req.session status');
  res.render('logout');
});


// SIGN UP PAGE
HomeController.route('/signup/?')
  .get(function(req, res, next) {
    res.render('signup')
  })
  // Register new user
  .post(function(req, res, next) {
    User.findOne({username: req.body.username}, function(err, user) {
      // Should username already exist
      if (err || user) {
      res.render('signup', {
      message: user ? "That username already exists!" : false
      });
      } 
      // Require all Sign Up fields to be completed
      else if (!user) {
        if ((req.body.password === '') || (req.body.password_confirmation === '') || (req.body.username === '') || (req.body.email === '')) {
          res.render('signup', {
          message: !user ? 'Please complete all fields!' : false
          });
        }
        // Require password and password confirmation to match
        else if (req.body.password !== req.body.password_confirmation) {
        res.render('signup', {
        message: req.body.password !== req.body.password_confirmation ? 'Your passwords do not match!' : false 
        });
        }
        // If passwords match
        else if (req.body.password === req.body.password_confirmation) {
          // Make password secure with bcrypt
          bcrypt.hash(req.body.password, 10, function(err, hash) {
            // Create new user document
            User.create({
            username: req.body.username,
            password: hash,
            email: req.body.email
            },
            function(err, user) {
              if (err) {
                console.log(err);
                res.render('signup');
              }
              else {
                console.log(user);
                console.log(req.session);
                req.session.isLoggedIn = true;
                req.session.userId     = user._id;
                res.redirect('/search');
              }
            });
          });
        }
      }
    });
  });


// HOME PAGE -> LOGIN
HomeController.route('/?') 
  .get(function(req, res, next) {
    res.render('home')
  })
   .post(function(req, res, next) {
    // Find user by username
    User.findOne( {username: req.body.username }, function(err, user) {
      // Require that all fields are completed
      if ((req.body.password === '') || (req.body.username === '')) {
        res.render('home', {
        message: (req.body.password === '') || (req.body.username === '') ? 'Please complete all fields!' : false
        });
        console.log('complete fields');
      }
      // Should username not exist
      else if (err || !user) {
        res.render('home', {
        message: req.session.isLoggedIn ? true : "Username not found!"
        });
      }
      else {
        // Compare the password with hashed db password 
        bcrypt.compare(req.body.password, user.password, function(err, result) {
          if (err) {
            console.log(err);
            res.send('ERROR: ' + err);
          }
          else if (result) {
            console.log(user)
            req.session.isLoggedIn = true;
            req.session.userId     = user._id;
            res.redirect('/search');
          } 
          else {
            res.render('home', {
            message: req.session.isLoggedIn ? true : "Your password is incorrect!"
            });
          }
        });
      }
    });
  });
 

module.exports = HomeController;
