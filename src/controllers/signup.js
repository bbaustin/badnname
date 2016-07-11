// SignUp Controller

var express         = require('express'),
    SignUpController  = express.Router(),
    User            = require(__dirname + '/../models/user'),
    bcrypt          = require('bcrypt');




SignUpController.route('/?')
///////////////////////////////////  
  .get(function(req, res, next) {
    res.render('signup', {})
  })
  .post(function(req, res, next) {
    bcrypt.hash(req.body.password, 10, function(err, hash) {
      // Save user in here
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
          res.redirect('/?')
      }
    });
    
    });
  });
  
 
 module.exports = SignUpController;
