// Home Controller

var express         = require('express'),
    HomeController  = express.Router(),
    User            = require(__dirname + '/../models/user'),
    bcrypt          = require('bcrypt'),
    session         = require('express-session');


       



//////////LOG OUT//////////////
// GET log out page
HomeController.route('/logout/?')
.get(function(req, res, next) {
// req.session.isLoggedIn = null;
// req.session = null;
  req.session.destroy()
  console.log(req.session, '------------------------------------------------------------- this is req.session')
  res.render('logout')
})


////////////SIGN UP//////////////
HomeController.route('/signup/?')
  // GET sign up page
  .get(function(req, res, next) {
    res.render('signup', {
    pageTitle: 'Sign Up'
    })
  })
  // Registers new user
  .post(function(req, res, next) {
    User.findOne({ username: req.body.username}, function(err, user) {
      if (err || user) {
      res.render('signup', {
      message: user ? "That username already exists!" : false
      })
      console.log('username exists')
      } 
      else if (!user) {
        if ((req.body.password === '') || (req.body.password_confirmation === '') || (req.body.username === '') || (req.body.email === '')) {
          res.render('signup', {
          message: !user ? 'Please complete all fields!' : false
          })
          console.log('complete fields')
        }
        else if (req.body.password !== req.body.password_confirmation) {
        res.render('signup', {
        message: req.body.password !== req.body.password_confirmation ? 'Your passwords do not match!' : false 
        })
        console.log('passwords dont match')
        }
        else if (req.body.password === req.body.password_confirmation) {
        // Make password secure with bcrypt
        bcrypt.hash(req.body.password, 10, function(err, hash) {
          // Create new user document based on user schema
          User.create({
          username: req.body.username,
          password: hash,
          email: req.body.email
          },
          function(err, user) {
            if (err) {
              console.log(err);
              res.render('signup', {error: err});
            }
            else {
              console.log(user);
              console.log(req.session);
              req.session.isLoggedIn = true;
              req.session.userId     = user._id;
              res.redirect('/search');
            }
          })
        })
        }
        }
      })
  });





//////////////HOME///////////////
HomeController.route('/?') 
  .get(function(req, res, next) {
    res.render('home', {
    pageTitle: 'Badnname'
    })
  })
   .post(function(req, res, next) {
    // find user by username
    User.findOne({username: req.body.username}, function(error, user) {
      if ((req.body.password === '') || (req.body.username === '')) {
        res.render('home', {
        message: (req.body.password === '') || (req.body.username === '') ? 'Please complete all fields!' : false
        })
        console.log('complete fields')
      }
      else if (error || !user) {
        res.render('home', {
        message: req.session.isLoggedIn ? true : "Username not found!"
      })
      }
      else {
        // Compare the password sent through the form. 
        bcrypt.compare(req.body.password, user.password, function(err, result) {
          if (err) {
            console.log(err)
            res.send('ERROR: ' + err);   // error in bcrypt library itself
          }
          else if (result) {
            console.log(user)
            req.session.isLoggedIn = true;
            req.session.userId     = user._id;
            res.redirect('/search')

          } else {
            console.log('Wrong password')
            res.render('home', {
            message: req.session.isLoggedIn ? true : "Your password is incorrect!"
            })
          }
        })
      }
    })
  })
 
 module.exports = HomeController;


